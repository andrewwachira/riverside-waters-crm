'use server'
import db from "@/lib/db";
import User from "@/lib/db/models/User";
import Client from "@/lib/db/models/Client";
import bcryptjs from "bcryptjs";
import { signIn,auth } from "@/auth";
import CryptoJS from "crypto-js";
import Filter from "@/lib/db/models/Filter";


export async function createUser(name, email, phoneNumber,password) {
    try{
        await db.connect();
        const existsEmail =await  User.findOne({email});
        const existsPhone = await User.findOne({phoneNumber:phoneNumber});
        if(existsEmail){
            await db.disconnect();
            return {status: 422,message:"User with the provided email already exists. Go to login and sign in if you opened an account with us."};
        }else if(existsPhone){
            await db.disconnect();
            return {status: 422,message:"User with the provided phone number already exists. Go to login and sign in if you opened an account with us."};
        }else {
            const newUser =  new User({
                name,email,
                password: bcryptjs.hashSync(password),
                phoneNumber,
                isSuperAdmin: false,
                isSubAdmin:true,
                isAuthenticated:false
            });
            await newUser.save();
            await signIn("credentials",{
                redirect:false,
                email,
                password
            });
            await db.disconnect();
            return {message:"Account created Successfully",status:201};
        }
    }catch(error){
        return {message:error.message,status:400};
    }
}

export const login = async (email,pass) => {
    try{
        const password = CryptoJS.AES.decrypt(pass,"You bleed just to know you're alive").toString(CryptoJS.enc.Utf8);
        await signIn("credentials",{email,password,redirect:false});
        return {status:200};
    }catch(error){
        return {message:error.message,status:500};
    }
    
}


export const createClientForm1 = async (firstName,lastName,phoneNumber,residence,contactName,contactCell) => {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403}
        }
        await db.connect()
        const client = new Client({
            firstName,lastName,phoneNumber,residence,
            contactPerson:{
                name:contactName,
                phoneNumber:contactCell
            }
        });
        await client.save();
        return {status:201};
    } catch (error) {
        return {error:error.message};
    }
}

export const getClients = async () => {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const clients = await Client.find({});
        const serialized = clients.map(doc=> db.convertClientDocToObj(doc));
       return (serialized);
        
    } catch (error) {
        return {error:error.message};
    }
}

export const saveFilterInfo = async ({clientID,clientName,sedimentFilter,u3_ChangeDate,pc_ChangeDate,ro_ChangeDate,rc_ChangeDate,adminComments}) => {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const prevInfo = await Filter.findById(clientID);
        if(!prevInfo){
            const filterInfo =  new Filter({
                clientId : clientID,
                sedimentFilter,
                u3_ChangeDate,ro_ChangeDate,pc_ChangeDate,rc_ChangeDate,
                $push:{changeHistory:
                    {
                        adminId : user._id,
                        comments: adminComments,
                        date: Date()
                    }
                }
            });
            const res =  await filterInfo.save();
            console.log("new",res);
            return {status:201,message:`Filter information for ${clientName} saved successfully`}
        }else{
           const res = await prevInfo.updateOne({clientId:clientID},{
                hasSedimentFilter:sedimentFilter,
                u3_ChangeDate,ro_ChangeDate,pc_ChangeDate,rc_ChangeDate,
                $push:{changeHistory:
                    {
                        adminId : user._id,
                        comments: adminComments,
                        date: Date()
                    }
                }
            })
            console.log("update",res);

            return {status:201,message:`Filter information for ${clientName} saved successfully`}
        }
        
    } catch (error) {
        console.log(error);
        return {status:500, message:error.message}
    }
}