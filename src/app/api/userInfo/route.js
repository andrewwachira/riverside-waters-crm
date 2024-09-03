import { NextResponse as res } from 'next/server'
import User from '@/lib/db/models/User';
import db from "@/lib/db";
import { auth } from '@/auth';

export async function GET(){
    await db.connect();
    const session = await auth()
    const userData = await User.findOne({email:session.user.email});
    await db.disconnect();
    return res.json(userData);
}