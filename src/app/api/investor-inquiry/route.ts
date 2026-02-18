import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { addSubmission, getRecipients } from '@/lib/submissions-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, organization, email, message } = body

    // Validate required fields
    if (!firstName || !lastName || !organization || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName}`

    // Log submission
    console.log('=== INVESTOR INQUIRY SUBMISSION ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Name:', fullName)
    console.log('Organization:', organization)
    console.log('Email:', email)
    console.log('Message:', message)
    console.log('===================================')

    let emailSent = false
    let emailError: string | undefined

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)
        const recipients = getRecipients()
        
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Silq Website <noreply@silq.tech>',
          to: recipients,
          replyTo: email,
          subject: `Investor Inquiry from ${fullName} (${organization})`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1E4A6D 0%, #2D5F7E 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
                .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 8px; }
                .content { background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 16px; }
                .label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
                .value { font-size: 15px; color: #1a1a1a; margin-top: 4px; }
                .message-box { background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 8px; }
                .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <span class="badge">INVESTOR INQUIRY</span>
                  <h1 style="margin: 0; font-size: 20px;">${fullName}</h1>
                  <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">${organization}</p>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Contact Name</div>
                    <div class="value">${fullName}</div>
                  </div>
                  <div class="field">
                    <div class="label">Organization</div>
                    <div class="value">${organization}</div>
                  </div>
                  <div class="field">
                    <div class="label">Email</div>
                    <div class="value"><a href="mailto:${email}">${email}</a></div>
                  </div>
                  <div class="field">
                    <div class="label">Message</div>
                    <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                  <div class="footer">
                    <p>Submitted from silq.tech investor inquiry form</p>
                    <p>Reply directly to this email to respond to ${fullName}</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        })
        emailSent = true
        console.log('Email sent successfully to:', recipients.join(', '))
      } catch (err) {
        emailError = err instanceof Error ? err.message : 'Unknown error'
        console.error('Failed to send email:', emailError)
      }
    } else {
      emailError = 'RESEND_API_KEY not configured'
      console.log('Email not sent: RESEND_API_KEY not configured')
    }

    // Store submission
    addSubmission({
      type: 'investor',
      data: { 
        name: fullName, 
        email, 
        organization, 
        message 
      },
      emailSent,
      emailError,
    })

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully', emailSent },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing investor inquiry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
