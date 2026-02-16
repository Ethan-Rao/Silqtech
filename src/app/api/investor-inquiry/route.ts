import { NextRequest, NextResponse } from 'next/server'

// Email sending is disabled until Resend is configured
// Set RESEND_API_KEY environment variable to enable email sending

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

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey && resendApiKey !== 'your_api_key_here') {
      // Dynamic import to avoid build errors when Resend isn't configured
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)
      
      const recipients = (process.env.CONTACT_EMAIL_RECIPIENTS || 'ethanr@silq.tech,brianm@silq.tech')
        .split(',')
        .map(e => e.trim())

      const { error } = await resend.emails.send({
        from: 'Silq Website <noreply@silq.tech>',
        to: recipients,
        replyTo: email,
        subject: `New Investor Inquiry from ${fullName} (${organization})`,
        html: `
          <h2>New Investor Inquiry</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Organization:</strong> ${organization}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        // Still return success to user - we'll see error in logs
      } else {
        console.log('Investor inquiry email sent successfully')
      }
    } else {
      // Log submission when email is not configured (staging mode)
      console.log('=== INVESTOR INQUIRY (Email not configured) ===')
      console.log('Name:', fullName)
      console.log('Organization:', organization)
      console.log('Email:', email)
      console.log('Message:', message)
      console.log('================================================')
    }

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully' },
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
