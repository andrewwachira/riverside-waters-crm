import { NextResponse as res } from 'next/server'
import System from "@/lib/db/models/System";
import db from "@/lib/db";

export async function GET(){
    await db.connect();
    await System.deleteMany();
    const system = new System({
        googleSignIn:false,
        adminAccounts: 2,
    })
    await system.save();
   
    await db.disconnect();
    return res.json({message:"Success"});
}