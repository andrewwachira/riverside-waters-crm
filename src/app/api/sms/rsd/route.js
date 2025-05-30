import { NextResponse as res } from "next/server";
import axios from "axios";

export async function POST(req) {
    const {client,message}  = await req.json();
    try {
        const {data} = await axios.post("https://smsportal.hostpinnacle.co.ke/SMSApi/send",
          {
                userid : "andrewwachira1",
                password : "Exclamation1!",
                senderid : "RIVERSIDE",
                msgType : "unicode",
                duplicatecheck : "true",
                sendMethod : "quick",
                sms: [
                    {
                    mobile: [client],
                    msg: message
                    }
                ]
            },
        )
        
        return res.json({message:"Text sent successfully"});
    } catch (error) {
        return res.json({message:error.message});
    }
}