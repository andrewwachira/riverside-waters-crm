'use server'
import db from "@/lib/db";
import User from "@/lib/db/models/User";
import Client from "@/lib/db/models/Client";
import bcryptjs from "bcryptjs";
import { signIn,auth } from "@/auth";
import CryptoJS from "crypto-js";
import Filter from "@/lib/db/models/Filter";
import System from "@/lib/db/models/System";
import AdminActivity from "@/lib/db/models/AdminActivity";

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
        const activity = new AdminActivity({
            name:"SYSTEM LOGIN",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Logged in at ${new Date()}`
            },
            date:Date.now()
        })
        await activity.save();
        return {status:200};
    }catch(error){
        return {message:error.message,status:500};
    }
    
}
export const sendResetLink = async (email) => {
    try{
        
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
        const activity = new AdminActivity({
            name:"CLIENT REGISTRATION",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Registered ${firstName} ${lastName}`
            },
            date:Date.now()
        })
        await activity.save();
        await db.disconnect();
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
        const serClients = [];
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
        })
       return (serClients);
        
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
        const client = await Client.findById(clientID);
        const prevInfo = await Filter.findById(clientID);
        if(!prevInfo){
            const filterInfo =  new Filter({
                clientId : clientID,
                sedimentFilter,
                u3_ChangeDate,ro_ChangeDate,pc_ChangeDate,rc_ChangeDate,
                changeHistory:[
                    {
                        adminId : user._id,
                        comments: adminComments,
                        date: Date()
                    }
                ]
            });
            await filterInfo.save();
            const activity = new AdminActivity({
                name:"CLIENT FILTER REGISTRATION",
                activity : {
                    admin: user.name,
                    adminId: user._id,
                    action: `Registered filters for ${client.firstName} ${client.lastName}`
                },
                date:Date.now()
            })
            await activity.save();
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
            const activity = new AdminActivity({
                name:"CLIENT FILTER UPDATE",
                activity : {
                    admin: user.name,
                    adminId: user._id,
                    action: `Updated filters for ${client.firstName} ${client.lastName}`
                },
                date:Date.now()
            })
            await activity.save();

            return {status:201,message:`Filter information for ${clientName} saved successfully`}
        }
        
    } catch (error) {
        return {status:500, message:error.message}
    }
}

export const editClientData = async({clientId,firstName,lastName,phoneNumber,residence,contactName,contactCell})=> {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const client = await Client.findById(clientId);
        await client.updateOne({
            firstName:firstName,
            lastName:lastName,
            phoneNumber:phoneNumber,
            residence:residence,
            "contactPerson.name":contactName,
            "contactPerson.phoneNumber":contactCell,
        })
        const activity = new AdminActivity({
            name:"CLIENT INFO UPDATE",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Updated client info for ${firstName} ${lastName}`
            },
            date:Date.now()
        })
        await activity.save();
        return{status:200}
    } catch (error) {
        return {status:500,error:error.message}
    }
}


export const editFilterData = async({clientId,sedimentFilter,u3_ChangeDate,ro_ChangeDate,pc_ChangeDate,rc_ChangeDate})=> {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const filter = await Filter.findOne({clientId});
        const client = await Client.findById(clientId);
        await filter.updateOne({
            sedimentFilter,u3_ChangeDate,ro_ChangeDate,pc_ChangeDate,rc_ChangeDate,
        })
        const activity = new AdminActivity({
            name:"CLIENT EDIT FILTER INFO",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Edited filters for ${client.firstName} ${client.lastName}`
            },
            date:Date.now()
        })
        await activity.save();
        return{status:200}
    } catch (error) {
        return {status:500,error:error.message}
    }
}

export const setGoogleSignIn = async(choice)=> {
    try {
        const user  = await auth();
        await db.connect();
        const system = await System.findOne();
        await system.updateOne({googleSignIn:choice});
        const activity = new AdminActivity({
            name:"GOOGLE SIGN IN SETTINGS",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Set google sign in as ${choice}`
            },
            date:Date.now()
        })
        await activity.save();
        return{status:200}
    } catch (error) {
        return {status:500,error:error.message}
    }
}

export const removeAdminSlot = async()=> {
    try {
        const user = await auth();
        await db.connect();
        const system = await System.findOne();
        const accounts = system.adminAccounts;
        await system.updateOne({adminAccounts:accounts-1});
        const activity = new AdminActivity({
            name:"REMOVE ADMIN SLOT",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Removed admin slot, remaining slots : ${accounts-1}`
            },
            date:Date.now()
        })
        await activity.save();
        return{status:200}
    } catch (error) {
        return {status:500,error:error.message}
    }
}

export const addAdminSlot = async()=> {
    try {
        const user = await auth();
        await db.connect();
        const system = await System.findOne();
        const accounts = system.adminAccounts;
        await system.updateOne({adminAccounts:accounts+1});
        const activity = new AdminActivity({
            name:"ADD ADMIN SLOT",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Added an admin slot, total slots : ${accounts+1}`
            },
            date:Date.now()
        })
        await activity.save();
        return{status:200}
    } catch (error) {
        return {status:500,error:error.message}
    }
}

export const deleteAdmin = async(id,email)=> {
    try {
        const user = await auth();
        await db.connect();
        const loggedUser = await User.find({email});
        if(loggedUser.email !== "drwangeci@gmail.com" && !loggedUser.isSuperAdmin){
            throw new Error ("This operation is only priveleged to the Root admin of the system");
        }else{
            await User.findByIdAndDelete(id);
            const activity = new AdminActivity({
                name:"DELETE ADMIN",
                activity : {
                    admin: user.name,
                    adminId: user._id,
                    action: `Removed admin slot, remaining slots : ${accounts-1}`
                },
                date:Date.now()
            })
            await activity.save();
            return{status:200};
        }
    } catch (error) {
        return {status:500,error:error.message}
    }
}

export const editUserProfile = async(name,phoneNumber,bio,email)=> {
    try {
        await db.connect();
        const res = await User.findOneAndUpdate({email},{name,phoneNumber:Number(phoneNumber),bio},{new:true});
        const activity = new AdminActivity({
            name:"UPDATE ADMIN PROFILE",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Updated admin profile for ${name}`
            },
            date:Date.now()
        })
        await activity.save();
        await db.disconnect();
        return{status:200,body:res};
    } catch (error) {
        return {status:500,error:error.message}
    }
}
