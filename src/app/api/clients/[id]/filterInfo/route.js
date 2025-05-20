import { NextResponse as res ,} from "next/server";
import Filter from "@/lib/db/models/Filter";
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
        const filter = await Filter.find({clientId});
        await db.disconnect();
        if(!filter){
            return res.json({status:404, error:"Filter information for client does not exist"});
        }else{
            return res.json({status:200, filter:filter[filter.length-1]});
        }
        }catch (error) {
            return res.json({status:500,error:error.message});
    }
}