import { NextResponse as res } from "next/server";
import axios from "axios";
import { sendSMS } from "@/lib/utils/notificationService";
export async function POST(req) {
    const {client,message}  = await req.json();
     try{
      sendSMS(client,message);
     } 
     catch(error){
       return res.json(error);
     }
}