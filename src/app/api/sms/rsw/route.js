import { NextResponse as res } from "next/server";
import { sendSMS } from "@/lib/utils/notificationService";

export async function POST(req) {
    const {client,message}  = await req.json();
     const smsResponse = await sendSMS(client, message);
    if (smsResponse.error) {
        return res.json({ error: smsResponse.error }, { status: 500 }); 
    }
    return res.json({ message: "SMS sent successfully" }, { status: 200 });
  
}