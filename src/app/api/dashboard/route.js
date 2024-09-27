import { NextResponse as res } from 'next/server'
import Client from "@/lib/db/models/Client";
import User from "@/lib/db/models/User";
import Filter from '@/lib/db/models/Filter';
import db from "@/lib/db";

export async function GET(){
    try {
        await db.connect();
        const numClients = await Client.countDocuments();
        const numUsers = await User.countDocuments();
        const filters = await Filter.countDocuments();
        const currentDate = new Date();
        const pastFilters = await Filter.find({
            $or: [
                { u3_ChangeDate: { $lt: currentDate } },  // u3_ChangeDate before today
                { ro_ChangeDate: { $lt: currentDate } },  // ro_ChangeDate before today
                { pc_ChangeDate: { $lt: currentDate } },  // pc_ChangeDate before today
                { rc_ChangeDate: { $lt: currentDate } }   // rc_ChangeDate before today
            ]
        });
        const futureFilters = await Filter.find({
            $or: [
                { u3_ChangeDate: { $gt: currentDate } },  // u3_ChangeDate before today
                { ro_ChangeDate: { $gt: currentDate } },  // ro_ChangeDate before today
                { pc_ChangeDate: { $gt: currentDate } },  // pc_ChangeDate before today
                { rc_ChangeDate: { $gt: currentDate } }   // rc_ChangeDate before today
            ]
        });
        const data = {
            clients: numClients,
            admins : numUsers,
            installations : filters,
            numFiltersDue:pastFilters.length,
            numUpcomingFilters: futureFilters.length
        }
        await db.disconnect();
        return res.json({message:"Success",payload:data});
    } catch (error) {
        console.log(error);
        return res.json({status:500,error});
    }
    
}