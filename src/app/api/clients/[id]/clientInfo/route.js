import { NextResponse as res ,} from "next/server";
import Client from "@/lib/db/models/Client";
import {auth } from "@/auth";
import db from "@/lib/db";

export async function GET(request,{params}) {
    //the request arguement above seems not being used, do not remove it as the function wont work.
    try {
        const clientId = params.id;
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const client = await Client.findById(clientId);
        if(!client){
            return res.json({status:404, error:"Client information for client does not exist"});
        }else{
            return res.json({status:200, client});
        }
        }catch (error) {
            return res.json({status:500,error:error.message});
    }
}