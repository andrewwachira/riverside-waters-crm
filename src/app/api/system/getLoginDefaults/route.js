import { NextResponse as res } from "next/server";
import db from "@/lib/db";
import System from "@/lib/db/models/System";
import User from "@/lib/db/models/User";
export const GET = async()=> {
    try {
        await db.connect();
        const system = await System.findOne().select("googleSignIn adminAccounts");
        const users = await User.collection.countDocuments();
        return res.json({status:200,system,users});
    } catch (error) {
        return res.json({status:500,error:error.message})
    }
}