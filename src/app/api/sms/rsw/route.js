import { NextResponse as res } from "next/server";
import axios from "axios";

export async function POST(req) {
    const {client,message}  = await req.json();
    const cleanPhoneNumbers = (phoneNumbers) => {
        return phoneNumbers.map(number => {
          // Convert to string in case some numbers are stored as integers
          let cleaned = number.toString();
          // If the number starts with '254254', remove the extra '254'
          if (cleaned.startsWith("254254")) {
            cleaned = cleaned.slice(3); // Remove the first three characters
          }
          // If the number starts with '0', replace it with '254'
          if (cleaned.startsWith("0")) {
            cleaned = "254" + cleaned.slice(1); // Replace leading '0' with '254'
          }
          // Return the cleaned number
          return cleaned;
        });
      };
      
      const cleanedNumbers = cleanPhoneNumbers(client);
      
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
                    mobile: cleanedNumbers,
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