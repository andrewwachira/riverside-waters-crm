import { NextResponse as res } from "next/server";
import db from "@/lib/db";
import System from "@/lib/db/models/System";
import  {auth} from "@/auth";
import User from "@/lib/db/models/User";

export async function GET() {
    try {
        const session = await auth();
        if(!session.user){
            throw new Error("Admin Login required");
        }
        await db.connect();
        const system = await System.findOne();
        const users = await User.find();
        await db.disconnect();
        return res.json({system,users});

    } catch (error) {
        return res.json({ error: 'Internal Server Error' }, { status: 500 });
    }
   
}