// app/api/contact/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { name, email, subject, message } = await request.json();

        // Basic validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Or your email provider's SMTP server
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "salman216030@gmail.com",
                pass: "ksay pfda gupq murs",
            },
        });

        const mailOptions = {
            from: `"${name}" <${"salman216030@gmail.com"}>`, // Sender's name and your sending email
            to: "support@smarttools.fun", // The address that receives the email
            replyTo: email, // Set the reply-to to the user's email
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h1>New Contact Form Submission</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr />
                <h2>Message:</h2>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Failed to send email:', error);
        return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }
}