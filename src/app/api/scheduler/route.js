import { NextResponse as res } from "next/server";
import db from "@/lib/db";
import Client from "@/lib/db/models/Client";
import  {auth} from "@/auth";
import Filter from "@/lib/db/models/Filter";

export async function GET() {
    try{
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const clients  = await Client.find({});
        const serClients = []
        clients.forEach(client => {
            const serialized ={
                _id: client._id.toString(),
                createdAt: client.createdAt.toDateString(),
                updatedAt: client.updatedAt.toDateString(),
                firstName: client.firstName,
                lastName: client.lastName,
                phoneNumber: client.phoneNumber,
                residence: client.residence,
                contactName: client.contactPerson.name,
                contactCell: client.contactPerson.phoneNumber,
            }
            serClients.push(serialized);
            return
        })

        const filters = await Filter.find({});
        const serFilters = [];
        filters.forEach(filter => {
            const serialized  = {
                _id: filter._id.toString(),
                createdAt: filter.createdAt.toDateString(),
                updatedAt: filter.updatedAt.toDateString(),
                clientId: filter.clientId.toString(),
                sedimentFilter: filter.sedimentFilter,
                u3_ChangeDate: filter.u3_ChangeDate.toDateString(),
                ro_ChangeDate: filter.ro_ChangeDate.toDateString(),
                pc_ChangeDate: filter.pc_ChangeDate.toDateString(),
                rc_ChangeDate: filter.rc_ChangeDate.toDateString(),
            }
            serFilters.push(serialized);
        })

        return  res.json({status:200,payload:{clients:serClients,filters:serFilters}});
    }catch(error){
        return res.json({status:500, message:error.message});
    }
   
}