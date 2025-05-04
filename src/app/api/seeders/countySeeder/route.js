import { NextResponse as res } from 'next/server'
import County from "@/lib/db/models/County";
import db from "@/lib/db";
import { counties } from '@/lib/utils/data/counties';

export async function GET(){
    await db.connect();
    await County.deleteMany();
    await County.insertMany(counties);
    await db.disconnect();
    return res.json({message:"seeded succesfully"})
}