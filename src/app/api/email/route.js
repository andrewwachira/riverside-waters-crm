import { NextResponse as res } from "next/server";
import { Resend } from 'resend';

export async function POST({params}) {
   
    const email = params.email;
    const subject = params.subject;
    const body = params.body;
    const resend = new Resend(process.env.RESEND);
    
    resend.emails.send({
      from: 'contact@riversidefilters.co.ke',
      to: email,
      subject,
      html: body
    });
}