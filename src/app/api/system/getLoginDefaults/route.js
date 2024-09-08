import { NextResponse as res } from "next/server";
import db from "@/lib/db";
import System from "@/lib/db/models/System";

export const GET = async()=> {
    try {
        await db.connect();
        const system = await System.findOne().select("googleSignIn");
        return res.json({status:200,system})
    } catch (error) {
        return res.json({status:500,error:error.message})
    }
}