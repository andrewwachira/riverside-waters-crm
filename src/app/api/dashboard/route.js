import { NextResponse as res } from 'next/server'
import Client from "@/lib/db/models/Client";
import User from "@/lib/db/models/User";
import Filter from '@/lib/db/models/Filter';
import db from "@/lib/db";

export async function GET(){
    try {
        await db.connect();
        const numClients = await Client.countDocuments();
        const clients = await Client.find({});
        const numAdmins = await User.countDocuments();
        const admins = await User.find({});
        const filters = await Filter.countDocuments();
        const currentDate = new Date();
        const pastFilters = await Filter.find({
            $or: [
                { u3_ChangeDate: { $lt: currentDate } },  // u3_ChangeDate before today
                { ro_ChangeDate: { $lt: currentDate } },  // ro_ChangeDate before today
                { pc_ChangeDate: { $lt: currentDate } },  // pc_ChangeDate before today
                { rc_ChangeDate: { $lt: currentDate } }   // rc_ChangeDate before today
            ]
        }).populate("clientId","firstName lastName residence");
        const futureFilters = await Filter.find({
            $or: [
                { u3_ChangeDate: { $gt: currentDate } },  // u3_ChangeDate before today
                { ro_ChangeDate: { $gt: currentDate } },  // ro_ChangeDate before today
                { pc_ChangeDate: { $gt: currentDate } },  // pc_ChangeDate before today
                { rc_ChangeDate: { $gt: currentDate } }   // rc_ChangeDate before today
            ]
        }).populate("clientId","firstName lastName residence");

        // Process the filters and only include future dates
        const cleanFutureFilters = futureFilters.map(filter=> {
            // Create an array of date fields
            const dateFields = [
                { key: 'ultra 3', value: filter.u3_ChangeDate },
                { key: 'reverse osmosis', value: filter.ro_ChangeDate },
                { key: 'post carbon', value: filter.pc_ChangeDate },
                { key: 'remineralizing cartilage', value: filter.rc_ChangeDate }
            ];
            // Filter out the dates that are in the future
            const futureDates = dateFields.filter(dateField => dateField.value > currentDate);
            // If there are no future dates, return null to exclude this filter
            if (!futureDates.length) return null;
            // Construct a result object including only future dates
            const result = {
                _id: filter._id,
                clientId: filter.clientId,
                changeHistory: filter.changeHistory,
                createdAt: filter.createdAt,
                updatedAt: filter.updatedAt,
                futureDates
            };
            return result;
        });


        // Process the filters and only include past dates
        const cleanPastFilters = pastFilters.map(filter=> {
            // Create an array of date fields
            const dateFields = [
                { key: 'ultra 3', value: filter.u3_ChangeDate },
                { key: 'reverse osmosis', value: filter.ro_ChangeDate },
                { key: 'post carbon', value: filter.pc_ChangeDate },
                { key: 'remineralizing cartilage', value: filter.rc_ChangeDate }
            ];
            // Filter out the dates that are in the past
            const pastDates = dateFields.filter(dateField => dateField.value < currentDate);
            // If there are no past dates, return null to exclude this filter
            if (!pastDates.length) return null;
            // Construct a result object including only past dates
            const result = {
                _id: filter._id,
                clientId: filter.clientId,
                changeHistory: filter.changeHistory,
                createdAt: filter.createdAt,
                updatedAt: filter.updatedAt,
                pastDates
            };
            return result;
        })

        const data = {
            numClients,
            clients,
            admins,
            numAdmins,
            installations : filters,
            numFiltersDue:pastFilters.length,
            filtersDue : cleanPastFilters,
            upcomingFilters:cleanFutureFilters,
            numUpcomingFilters: futureFilters.length,
        }
        await db.disconnect();
        return res.json({message:"Success",payload:data});
    } catch (error) {
        console.log(error);
        return res.json({status:500,error});
    }
    
}