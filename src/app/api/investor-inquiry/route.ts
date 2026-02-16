import { NextRequest, NextResponse } from 'next/server'

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

    // Log submission (staging mode - emails not configured)
    console.log('=== INVESTOR INQUIRY SUBMISSION ===')
    console.log('Name:', fullName)
    console.log('Organization:', organization)
    console.log('Email:', email)
    console.log('Message:', message)
    console.log('===================================')

    // TODO: When ready to enable email sending:
    // 1. Install resend: npm install resend
    // 2. Add RESEND_API_KEY to environment variables
    // 3. Uncomment the email sending code below
    
    /*
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)
      
      await resend.emails.send({
        from: 'Silq Website <noreply@silq.tech>',
        to: ['ethanr@silq.tech', 'brianm@silq.tech'],
        replyTo: email,
        subject: `Investor Inquiry from ${fullName} (${organization})`,
        html: `<p><strong>Name:</strong> ${fullName}</p>
               <p><strong>Organization:</strong> ${organization}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`,
      })
    }
    */

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
