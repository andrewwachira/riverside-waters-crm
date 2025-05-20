import { NextRequest as req, NextResponse as res } from "next/server";
import { sendEmail } from "@/lib/utils/notificationService";

export async function POST(req) {
   const { email, subject, body } = await req.json();
    if (!email || !subject || !body) {
        return res.json({ error: "Missing required fields" }, { status: 400 });   
    }
   
    const emailResponse = await sendEmail(email, subject, body);
    if (emailResponse.error) {
        return res.json({ error: emailResponse.error }, { status: 500 });
    }
    return res.json({ message: "Email sent successfully" }, { status: 200 });
}