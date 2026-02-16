import os
import re
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

# --- Paths / constants ---
FILTERED_DIR   = "Filtered_Facilities"
GEOCODE_CACHE  = "geocoded_cache_cleaned.csv"
OUTPUT_FOLDER  = "Squarespace_Code"
PAD_FACTOR     = 1.0

# High-contrast, map-friendly colors (cycled as needed)
VIBRANT_COLORS = [
    "#e41a1c",  # red
    "#377eb8",  # blue
    "#4daf4a",  # green
    "#ff7f00",  # orange
    "#984ea3",  # purple
    "#a65628",  # brown
    "#f781bf",  # pink
    "#999999",  # gray
    "#66c2a5",  # teal
    "#ffd92f",  # yellow (still quite visible)
]

os.makedirs(OUTPUT_FOLDER, exist_ok=True)
locator = Nominatim(user_agent="facility_mapper", timeout=10)
geocode = RateLimiter(locator.geocode, min_delay_seconds=1, max_retries=2, error_wait_seconds=5)

if os.path.exists(GEOCODE_CACHE):
    geo_cache = pd.read_csv(GEOCODE_CACHE, index_col="address")
else:
    geo_cache = pd.DataFrame(columns=["address","lat","lon"]).set_index("address")

def update_geocode_cache(addresses):
    missing = [a for a in set(addresses) if a not in geo_cache.index]
    for addr in missing:
        try:
            loc = geocode(addr)
            lat, lon = (loc.latitude, loc.longitude) if loc else (None, None)
        except:
            lat, lon = None, None
        geo_cache.loc[addr, ["lat","lon"]] = [lat, lon]
    if missing:
        geo_cache.to_csv(GEOCODE_CACHE)

def clean_string(s):
    return s.upper().strip().replace(",", "").replace(".", "") if isinstance(s, str) else ""

# ---------- Data standardization ----------
def _standardize_facility_df(df_fac):
    rename_map = {}
    for c in df_fac.columns:
        lc = str(c).strip().lower()
        if lc in {"facility id", "facility_id", "id"}:
            rename_map[c] = "Facility_ID"
        elif lc in {"facility name", "name"}:
            rename_map[c] = "Facility Name"
        elif lc in {"state"}:
            rename_map[c] = "State"
        elif lc in {"city"}:
            rename_map[c] = "City"
        elif lc in {"facility type", "type"}:
            rename_map[c] = "Facility Type"
        elif lc in {"gpo membership", "gpo", "gpo_member"}:
            rename_map[c] = "GPO Membership"
        elif lc in {"address", "street address", "addr"}:
            rename_map[c] = "Address"
        elif lc in {"phone", "phone number", "telephone"}:
            rename_map[c] = "Phone"
        elif lc in {"days", "score", "usage days"}:
            rename_map[c] = "Days"
    df_fac = df_fac.rename(columns=rename_map)

    for col in ["Facility_ID","Facility Name","State","City","Facility Type","GPO Membership","Address","Phone","Days"]:
        if col not in df_fac.columns:
            df_fac[col] = "" if col != "Days" else 0

    df_fac["Facility_ID"] = df_fac["Facility_ID"].astype(str)
    for col in ["State","City","Facility Type"]:
        df_fac[col] = df_fac[col].apply(clean_string)
    df_fac["Days"] = pd.to_numeric(df_fac["Days"], errors="coerce")
    return df_fac

def _standardize_physician_df(df_doc):
    rename_map = {}
    for c in df_doc.columns:
        lc = str(c).strip().lower()
        if lc in {"facility id", "facility_id", "id"}:
            rename_map[c] = "Facility_ID"
        elif lc in {"urologist name", "name", "doctor name", "physician name", "provider name"}:
            rename_map[c] = "Name"
        elif lc in {"npi", "npi number", "npi_id"}:
            rename_map[c] = "NPI"
        elif lc in {"primary specialty", "specialty", "primary_specialty"}:
            rename_map[c] = "Primary Specialty"
    df_doc = df_doc.rename(columns=rename_map)

    for col in ["Facility_ID", "Name", "NPI", "Primary Specialty"]:
        if col not in df_doc.columns:
            df_doc[col] = ""

    df_doc["Facility_ID"] = df_doc["Facility_ID"].astype(str)
    df_doc["Name"] = df_doc["Name"].astype(str).str.strip()
    df_doc["NPI"] = df_doc["NPI"].astype(str).str.strip()
    df_doc["Primary Specialty"] = df_doc["Primary Specialty"].astype(str).str.strip()
    return df_doc[(df_doc["Name"] != "") | (df_doc["NPI"] != "")]

def _pick_sheet_name(sheets_dict, want="facility"):
    names = list(sheets_dict.keys())
    key = want.lower()
    def ok(n):
        ln = n.lower()
        if key == "facility":
            return ln.startswith("facility") or "facility" in ln or ln.startswith("fac_") or ln.startswith("fac")
        return (ln.startswith("doctor") or "doctor" in ln or
                ln.startswith("urologist") or "urologist" in ln or
                ln.startswith("physician") or "physician" in ln)
    cand = [n for n in names if ok(n)]
    return cand[0] if cand else None

# ---------- HTML pieces ----------
def generate_html_list(df_fac, df_doc):
    df = df_fac.copy()
    u  = df_doc.copy()
    df['Facility_ID'] = df['Facility_ID'].astype(str)
    u['Facility_ID']  = u['Facility_ID'].astype(str)

    exclude   = ['Facility_ID','Facility Name','State','City','Facility Type']
    score_col = "Days" if "Days" in df.columns else ([c for c in df.columns if c not in exclude][-1] if any(c not in exclude for c in df.columns) else None)
    if score_col is None:
        df["__score__"] = 0
        score_col = "__score__"
    df[score_col] = pd.to_numeric(df[score_col], errors='coerce')
    df.sort_values(score_col, ascending=False, inplace=True)
    cutoff = df[score_col].quantile(0.9) if df[score_col].notna().any() else float("inf")

    disp_cols = [c for c in df.columns if c not in ['Facility_ID', score_col]]
    header_html = ''.join(f"<th>{c}</th>" for c in disp_cols) + "<th>Physicians</th>"
    rows = []

    for _, row in df.iterrows():
        fid = row['Facility_ID']
        is_high = (row[score_col] >= cutoff) if pd.notna(row[score_col]) else False
        bg_color = '#fffbe7' if is_high else '#f9f9f9'
        cells = ''
        for c in disp_cols:
            val = row[c]
            if c == 'Facility Name' and is_high:
                cells += (
                    f"<td style='background:{bg_color}; padding:12px; font-weight:bold;'>"
                    f"<div style='font-size:1.05em'>{val}</div>"
                    f"<div class='high-label'>★ High Use Facility ★</div>"
                    "</td>"
                )
            else:
                cells += f"<td style='background:{bg_color}; padding:12px;'>{val}</td>"
        cells += (f"<td style='background:{bg_color}; padding:12px;'>"
                  f"<button class='view-btn' data-fid='{fid}'>View Physician</button>"
                  "</td>")
        rows.append(
            f"<tr data-fac-id='{fid}' data-state='{row['State']}'"
            f" style='box-shadow:0 1px 3px rgba(0,0,0,0.06); margin-bottom:3px;'>" + cells + "</tr>"
        )

        # Overlay (Name, NPI, Primary Specialty only)
        overlay_rows, seen = [], set()
        subset = u[u['Facility_ID'] == fid] if 'Facility_ID' in u.columns else pd.DataFrame(columns=u.columns)
        for _, doc in subset.iterrows():
            key = (doc.get('Name','').strip(), doc.get('NPI','').strip())
            if key in seen: 
                continue
            seen.add(key)
            overlay_rows.append(
                "<tr>"
                f"<td>{doc.get('Name','')}</td>"
                f"<td>{doc.get('NPI','')}</td>"
                f"<td>{doc.get('Primary Specialty','')}</td>"
                "</tr>"
            )
        rows.append(
            f"<tr id='ov_{fid}' class='overlay' style='display:none;'>"
            f"<td colspan='{len(disp_cols)+1}'>"
            f"<div class='overlay-table-wrapper'>"
            "<table class='overlay-table'>"
            "<tr style='background:#007ACC;color:#fff;'><th>Name</th><th>NPI</th><th>Primary Specialty</th></tr>"
            + ''.join(overlay_rows) +
            "</table></div></td></tr>"
        )

    return header_html, "\n".join(rows)

def generate_embed_txt(df_fac, df_doc):
    header_html, rows_html = generate_html_list(df_fac, df_doc)

    # Geocode addresses
    df = df_fac.copy()
    city = df['City'].astype(str).str.title() if 'City' in df.columns else ''
    state = df['State'] if 'State' in df.columns else ''
    address = df['Address'] if 'Address' in df.columns else ''
    df['full_address'] = address.fillna('') + ', ' + city + ', ' + state
    update_geocode_cache(df['full_address'])
    geo_df = geo_cache.reset_index().rename(columns={'address': 'full_address'})
    df = df.merge(geo_df, on='full_address', how='left').dropna(subset=['lat', 'lon'])

    # Distinct colors without outlines (size unchanged)
    colors = [VIBRANT_COLORS[i % len(VIBRANT_COLORS)] for i in range(len(df))]

    fig = go.Figure(
        go.Scattermapbox(
            lat=df['lat'], lon=df['lon'], mode='markers',
            marker=dict(
                size=11,          # unchanged
                color=colors,     # high-contrast palette
                opacity=1.0       # bolder without outlines
            ),
            customdata=df['Facility_ID'],
            hovertext=df['Facility Name'],
            hovertemplate='%{hovertext}<extra></extra>',
            cluster=dict(enabled=True, maxzoom=6, step=15, size=40, color='grey', opacity=0.82)
        )
    )
    lat_min, lat_max = df['lat'].min(), df['lat'].max()
    lon_min, lon_max = df['lon'].min(), df['lon'].max()
    pad_lat = (lat_max - lat_min) * PAD_FACTOR
    pad_lon = (lon_max - lon_min) * PAD_FACTOR
    fig.update_layout(
        mapbox_style='open-street-map',
        mapbox=dict(bounds=dict(
            north=lat_max + pad_lat,
            south=lat_min - pad_lat,
            east=lon_max + pad_lon,
            west=lon_min - pad_lon
        )),
        margin=dict(l=0, r=0, t=0, b=0),
        autosize=True,
    )

    # Legend with same palette
    legend = (
        f'<div id="legend-highlight-row">'
        f'<button id="highlight-btn">Highlight Area</button>'
        f'<div id="legend-overlay">'
        + ''.join(
            f"<span class='legend-square' style='background:{VIBRANT_COLORS[i % len(VIBRANT_COLORS)]};'></span>"
            f"<span class='legend-label'>{t}</span>"
            for i, t in enumerate(df['Facility Type'].unique())
        )
        + '</div>'
        '</div>'
    )

    table_high = (
        "<div id='high-container' style='display:none; text-align:center;'>"
        "<h3 style='text-align:center;margin-bottom:0.5em;'>Highlighted Facilities</h3>"
        "<div style='display:inline-block;width:100%;'>"
        "<table id='highlighted_table' style='width:100%;margin:auto; background:#f8fafc; border-radius:8px;'>"
        "<tr>" + header_html + "</tr>"
        "</table></div></div>"
    )

    instruction = (
        "<div id='highlight-instruction' style='display:none; text-align:center; margin:10px; color:#007ACC;'>"
        "Click and drag on the map to select facilities."
        "</div>"
    )

    map_html = (
        '<div id="map-wrapper">'
        + fig.to_html(
            div_id='map-div', full_html=False, include_plotlyjs='cdn',
            config={'scrollZoom': True, 'displayModeBar': True}
        )
        + legend
        + '</div>'
    )

    states = sorted(df['State'].unique())
    filters = (
        '<div id="state-filters">'
        + ''.join(
            f"<label><input type='checkbox' class='state-checkbox' value='{s}' checked> {s}</label>" for s in states
        )
        + '</div>'
    )

    table_all = (
        "<h3 style='text-align:center;'>All Facilities</h3>" + filters +
        "<div style='display:flex;justify-content:center;width:100%;margin:auto;'><table id='fac_table' style='width:100%;margin:auto; background:#f8fafc; border-radius:8px;'>"
        "<tr>" + header_html + "</tr>" + rows_html + "</table></div>"
    )

    css = """
<style>
  html, body { background:#f3f6fa; }
  h3, #legend, #state-filters, #highlight-instruction { text-align:center; }
  #map-wrapper { position:relative; width:100%; max-width:100vw; aspect-ratio: 5/3; margin:auto; min-height:350px; }
  #map-div { width:100% !important; min-height:350px; aspect-ratio: 5/3; }
  #legend-highlight-row { display:flex; flex-direction:row; align-items:flex-start; position:absolute; top:14px; left:0; right:0; z-index:10; width:100%; max-width:100vw; justify-content:center; pointer-events:none; user-select:none; }
  #legend-overlay { flex:0 0 60%; background:rgba(255,255,255,0.98); box-shadow:0 2px 8px #b4c6dd; padding:13px 28px 13px 20px; border-radius:9px; font-size:1.05em; line-height:1.8; letter-spacing:.01em; display:inline-block; min-width:200px; max-width:100vw; pointer-events:auto; }
  #highlight-btn { margin-right:22px; padding:24px 48px; font-size:18px; border-radius:8px; box-shadow:0 2px 6px #c0c0c0; background:#007ACC; color:#fff; border:none; cursor:pointer; font-weight:bold; letter-spacing:.01em; transition:.14s; height:fit-content; pointer-events:auto; user-select:auto; }
  #highlight-btn:hover { background:#005f9e; box-shadow:0 3px 8px #a0a0a0; }
  .legend-square { display:inline-block; width:14px; height:14px; margin-right:7px; border-radius:2px; vertical-align:middle; }
  .legend-label { vertical-align:middle; font-size:1.01em; margin-right:16px; }
  #state-filters { width:100%; max-width:100vw; margin:auto; text-align:center; margin-bottom:0.5em; }
  #state-filters input[type='checkbox'] { transform: scale(1.23); margin:0 10px; }
  #state-filters label { margin-right:20px; }
  #fac_table, #highlighted_table, .overlay-table { width:100% !important; max-width:100vw; border-collapse:separate; border-spacing:0 4px; margin:auto; background:#f8fafc; border-radius:8px; }
  #fac_table th, #highlighted_table th, .overlay-table th { background:#007ACC; color:#fff; padding:13px 8px; text-transform:uppercase; text-align:center; font-size:1.04em; }
  #fac_table td, #highlighted_table td, .overlay-table td { background:#f9f9f9; border:1px solid #e3e8ee; padding:12px 8px; text-align:center; font-size:1.01em; }
  #fac_table tr, #highlighted_table tr, .overlay-table tr { transition:background 0.12s; }
  #fac_table tr:hover, #highlighted_table tr:hover, .overlay-table tr:hover { background:#e8f3ff; }
  .high-label { font-size:0.97em; color:#d99c00; margin-top:4px; display:block; text-align:center; font-weight:bold; letter-spacing:.01em; }
  .view-btn { background:linear-gradient(90deg,#1583ff,#1ec9ff); color:white; border:none; border-radius:6px; padding:6px 18px; cursor:pointer; font-size:1em; font-weight:500; box-shadow:0 1px 5px #cfd5db; letter-spacing:.01em; transition:.12s; }
  .view-btn:hover { background:linear-gradient(90deg,#0d5ea8,#1fa8e2); color:#fff; box-shadow:0 2px 10px #b0b5bb; }
  .overlay-table-wrapper { width:60% !important; min-width:280px; max-width:100vw; margin:auto; }
  .overlay-table td, .overlay-table th { border:1.1px solid #c8d0da; background:#fafdff; }
</style>
"""

    script = """
<script>
document.addEventListener('DOMContentLoaded', function() {
  // View Physician button (delegated)
  document.body.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('view-btn')) {
      var fid = e.target.getAttribute('data-fid');
      var thisRow = e.target.closest('tr');
      var thisTable = thisRow ? thisRow.closest('table') : null;
      var overlayId = 'ov_' + fid;
      var overlayRow = null;
      if (thisTable) {
        var rows = Array.from(thisTable.rows);
        var idx = rows.indexOf(thisRow);
        if (idx >= 0 && rows[idx+1] && rows[idx+1].id === overlayId) {
          overlayRow = rows[idx+1];
        }
      }
      if (overlayRow) {
        overlayRow.style.display = overlayRow.style.display === 'none' ? '' : 'none';
      } else {
        var mainOverlay = document.getElementById(overlayId);
        if (mainOverlay) {
          var clone = mainOverlay.cloneNode(true);
          clone.style.display = '';
          if (thisRow && thisRow.nextSibling && thisRow.nextSibling.classList && thisRow.nextSibling.classList.contains('overlay')) {
            thisRow.parentNode.removeChild(thisRow.nextSibling);
          }
          if (thisRow && thisRow.parentNode) {
            thisRow.parentNode.insertBefore(clone, thisRow.nextSibling);
          }
        }
      }
    }
  });

  // State filtering
  document.querySelectorAll('.state-checkbox').forEach(function(cb) {
    cb.addEventListener('change', function() {
      var checkedStates = Array.from(document.querySelectorAll('.state-checkbox:checked')).map(x => x.value);
      document.querySelectorAll('#fac_table tr[data-fac-id]').forEach(function(row) {
        var state = row.getAttribute('data-state');
        row.style.display = checkedStates.includes(state) ? '' : 'none';
        var ovrow = document.getElementById('ov_' + row.getAttribute('data-fac-id'));
        if (ovrow) ovrow.style.display = 'none';
      });
    });
  });

  // Highlight selection
  var gd = document.getElementById('map-div'),
      btn = document.getElementById('highlight-btn'),
      highContainer = document.getElementById('high-container'),
      instruction = document.getElementById('highlight-instruction'),
      active = false,
      hdr = document.querySelector('#fac_table tr').outerHTML;

  btn.onclick = function() {
    if (!active) {
      Plotly.relayout(gd, {dragmode: 'select'});
      btn.textContent = 'Refresh Map';
      highContainer.style.display = '';
      if (instruction) instruction.style.display = '';
      active = true;
    } else {
      window.location.reload();
    }
  };
  gd.on('plotly_relayout', function(eventdata) {
    if (eventdata['dragmode'] === 'select') {
      document.getElementById('highlighted_table').innerHTML = '<tr>' + hdr + '</tr>';
    }
  });
  gd.on('plotly_selected', function(e) {
    var ids = (e && e.points) ? e.points.map(p => p.customdata) : [];
    var out = '<tr>' + hdr + '</tr>';
    ids.forEach(function(id) {
      var row = document.querySelector("#fac_table tr[data-fac-id='" + id + "']");
      if (row) out += row.outerHTML;
    });
    document.getElementById('highlighted_table').innerHTML = out;
  });
});
</script>
"""
    return css + table_high + instruction + map_html + table_all + script

def main():
    xlsx_files = [f for f in os.listdir(FILTERED_DIR) if f.endswith('.xlsx')]
    if not xlsx_files:
        print(f"No Excel files found in '{FILTERED_DIR}'")
        return

    for fname in xlsx_files:
        path = os.path.join(FILTERED_DIR, fname)
        try:
            sheets = pd.read_excel(path, sheet_name=None)
        except Exception as e:
            print(f"❌ Error reading {fname}: {e}")
            continue

    # pick sheets
        fac_sheet = _pick_sheet_name(sheets, "facility")
        doc_sheet = _pick_sheet_name(sheets, "doctor")
        if fac_sheet is None or doc_sheet is None:
            print(f"⚠️ {fname} missing required sheets (need Facility_* and Doctor_/Urologist_/Physician_*). Found: {list(sheets.keys())}")
            continue

        df_fac = _standardize_facility_df(sheets[fac_sheet].copy())
        df_doc = _standardize_physician_df(sheets[doc_sheet].copy())
        df_doc = df_doc[df_doc['Facility_ID'].isin(df_fac['Facility_ID'])]

        html = generate_embed_txt(df_fac, df_doc)
        out_name = os.path.splitext(fname)[0] + ".txt"
        out_path = os.path.join(OUTPUT_FOLDER, out_name)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"✅ Wrote embed for {fname} -> {out_path}")

if __name__ == '__main__':
    main()
