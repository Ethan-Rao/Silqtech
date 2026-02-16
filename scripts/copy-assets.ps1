# PowerShell script to copy assets from existing project
# Run from the silq-website directory: .\scripts\copy-assets.ps1

$sourceRoot = ".."
$destRoot = "public/images"

# Create directories
$dirs = @(
    "$destRoot/logos",
    "$destRoot/products", 
    "$destRoot/team",
    "$destRoot/textures",
    "$destRoot/science",
    "$destRoot/trust",
    "$destRoot/ui"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Write-Host "Created: $dir"
}

# Copy function with error handling
function Copy-Asset {
    param (
        [string]$source,
        [string]$dest
    )
    
    $fullSource = Join-Path $sourceRoot $source
    if (Test-Path $fullSource) {
        Copy-Item $fullSource $dest -Force
        Write-Host "Copied: $source -> $dest" -ForegroundColor Green
    } else {
        Write-Host "Missing: $source" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Copying Logo Assets ===" -ForegroundColor Cyan
Copy-Asset "Images/Logo_Main_SIL+%283%29.png.webp" "$destRoot/logos/logo-main.png"
Copy-Asset "Images/Logo_OneLine_SIL+%282%29.png.webp" "$destRoot/logos/logo-oneline.png"

Write-Host "`n=== Copying Product Images ===" -ForegroundColor Cyan
Copy-Asset "Images/boxnew.jpg.jpeg" "$destRoot/products/boxnew.jpg"

Write-Host "`n=== Copying Texture Images ===" -ForegroundColor Cyan
Copy-Asset "Images/Textures_SIL_6.jpg.jpeg" "$destRoot/textures/texture-hero.jpg"
Copy-Asset "Images/Textures_SIL_4.jpg.jpeg" "$destRoot/textures/texture-tech.jpg"
Copy-Asset "Images/water5.jpg.jpeg" "$destRoot/textures/texture-coating.jpg"

Write-Host "`n=== Copying Science Images ===" -ForegroundColor Cyan
Copy-Asset "Images/Droplet+Angle.jpg.jpeg" "$destRoot/science/droplet-angle.jpg"
Copy-Asset "Images/Surface+Droplet.jpg.jpeg" "$destRoot/science/surface-droplet.jpg"

Write-Host "`n=== Copying Trust Badges ===" -ForegroundColor Cyan
Copy-Asset "Images/fda.png" "$destRoot/trust/fda.png"
Copy-Asset "Images/ucla.jpg.webp" "$destRoot/trust/ucla.jpg"
Copy-Asset "Images/vzt_awardsupp_r_rgb_orn_pos.png" "$destRoot/trust/verizon-award.png"

Write-Host "`n=== Copying UI Elements ===" -ForegroundColor Cyan
Copy-Asset "Images/divider.png" "$destRoot/ui/divider.png"

Write-Host "`n=== Copying Favicon ===" -ForegroundColor Cyan
Copy-Asset "Images/favicon.ico.png" "public/favicon.ico"

Write-Host "`n=== Copying Team Photos ===" -ForegroundColor Cyan
# Find the OUR TEAM folder using wildcard to avoid special character issues
$teamFolder = Get-ChildItem "$sourceRoot/Pages" -Directory -Filter "OUR TEAM*" | Select-Object -First 1
if ($teamFolder) {
    $teamPath = $teamFolder.FullName
    Write-Host "Found team folder: $teamPath" -ForegroundColor Cyan
    
    # Copy team photos using wildcards
    $teamPhotos = @(
        @{pattern="*Verne*"; dest="verne-sharma.jpg"},
        @{pattern="*Jack*"; dest="jack-kavanaugh.jpg"},
        @{pattern="*Kaner*"; dest="richard-kaner.jpg"},
        @{pattern="*Brian*"; dest="brian-mcverry.jpg"},
        @{pattern="*Untitled*"; dest="mahi-desilva.jpg"},
        @{pattern="*Robert*"; dest="robert-snukal.jpg"}
    )
    
    foreach ($photo in $teamPhotos) {
        $sourceFile = Get-ChildItem $teamPath -Filter $photo.pattern | Select-Object -First 1
        if ($sourceFile) {
            Copy-Item $sourceFile.FullName "$destRoot/team/$($photo.dest)" -Force
            Write-Host "Copied: $($sourceFile.Name) -> $($photo.dest)" -ForegroundColor Green
        } else {
            Write-Host "Missing team photo matching: $($photo.pattern)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Could not find OUR TEAM folder" -ForegroundColor Red
}

Write-Host "`n=== Copying Additional Science Images ===" -ForegroundColor Cyan
# Find PLATFORM TECHNOLOGY folder
$techFolder = Get-ChildItem "$sourceRoot/Pages" -Directory -Filter "PLATFORM TECH*" | Select-Object -First 1
if ($techFolder) {
    $techPath = $techFolder.FullName
    
    $zwitterion = Get-ChildItem $techPath -Filter "zwitterion*" | Select-Object -First 1
    if ($zwitterion) {
        Copy-Item $zwitterion.FullName "$destRoot/science/zwitterion.jpg" -Force
        Write-Host "Copied: zwitterion.jpg" -ForegroundColor Green
    }
    
    $labImg = Get-ChildItem $techPath -Filter "*engineering*" | Select-Object -First 1
    if ($labImg) {
        Copy-Item $labImg.FullName "$destRoot/textures/texture-lab.jpg" -Force
        Write-Host "Copied: texture-lab.jpg" -ForegroundColor Green
    }
}

# Find EXTERNAL COATING folder for contact angle image
$coatFolder = Get-ChildItem "$sourceRoot/Pages" -Directory -Filter "EXTERNAL COATING*" | Select-Object -First 1
if ($coatFolder) {
    $coatPath = $coatFolder.FullName
    
    $contactAngle = Get-ChildItem $coatPath -Filter "*Contact*Angle*" | Select-Object -First 1
    if ($contactAngle) {
        Copy-Item $contactAngle.FullName "$destRoot/science/contact-angle.png" -Force
        Write-Host "Copied: contact-angle.png" -ForegroundColor Green
    }
}

# Find CLEARTRACT folder for product hero
$ctFolder = Get-ChildItem "$sourceRoot/Pages" -Directory -Filter "CLEARTRACT*" | Select-Object -First 1
if ($ctFolder) {
    $ctPath = $ctFolder.FullName
    
    $heroImg = Get-ChildItem $ctPath -Filter "*Screenshot*" | Select-Object -First 1
    if ($heroImg) {
        Copy-Item $heroImg.FullName "$destRoot/products/cleartract-hero.png" -Force
        Write-Host "Copied: cleartract-hero.png" -ForegroundColor Green
    }
}

Write-Host "`n=== Asset Copy Complete ===" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server."
