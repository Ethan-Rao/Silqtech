import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { addSubmission } from '@/lib/submissions-store'

const CLEARTRACT_RECIPIENT = 'ethanr@silq.tech'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contactInfo, message } = body

    if (!name || !contactInfo || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Accept either a valid email or a phone number
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo)
    const isPhone = /^[\+\d\s\-\(\)]{7,}$/.test(contactInfo)
    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { error: 'Please provide a valid email address or phone number' },
        { status: 400 }
      )
    }

    console.log('=== CLEARTRACT CUSTOMER CONTACT SUBMISSION ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Name:', name)
    console.log('Contact Info:', contactInfo)
    console.log('Message:', message)
    console.log('==============================================')

    let emailSent = false
    let emailError: string | undefined

    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Silq Website <noreply@silq.tech>',
          to: [CLEARTRACT_RECIPIENT],
          // Reply-To only works if contactInfo is an email
          ...(isEmail ? { replyTo: contactInfo } : {}),
          subject: `ClearTract Customer Inquiry from ${name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00ADEF 0%, #0090CC 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
                .badge { display: inline-block; background: rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; letter-spacing: 0.5px; padding: 3px 10px; border-radius: 20px; margin-top: 8px; }
                .content { background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 16px; }
                .label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
                .value { font-size: 15px; color: #1a1a1a; margin-top: 4px; }
                .message-box { background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 8px; white-space: pre-wrap; }
                .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0; font-size: 20px;">ClearTract Customer Inquiry</h1>
                  <div class="badge">ClearTract SPT® Customer Support</div>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Name</div>
                    <div class="value">${name}</div>
                  </div>
                  <div class="field">
                    <div class="label">Email / Phone</div>
                    <div class="value">${isEmail ? `<a href="mailto:${contactInfo}">${contactInfo}</a>` : `<a href="tel:${contactInfo.replace(/\s/g, '')}">${contactInfo}</a>`}</div>
                  </div>
                  <div class="field">
                    <div class="label">Message</div>
                    <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                  <div class="footer">
                    <p>Submitted from silq.tech/customercontact</p>
                    ${isEmail ? `<p>Reply directly to this email to respond to ${name}</p>` : `<p>Customer provided a phone number — call or text to follow up.</p>`}
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        })
        emailSent = true
        console.log('ClearTract inquiry email sent to:', CLEARTRACT_RECIPIENT)
      } catch (err) {
        emailError = err instanceof Error ? err.message : 'Unknown error'
        console.error('Failed to send ClearTract inquiry email:', emailError)
      }
    } else {
      emailError = 'RESEND_API_KEY not configured'
    }

    addSubmission({
      type: 'contact',
      data: { name, email: isEmail ? contactInfo : '', phone: isPhone ? contactInfo : '', message, inquiryType: 'ClearTract Customer' },
      emailSent,
      emailError,
    })

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully', emailSent },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing ClearTract customer contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
