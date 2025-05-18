'use server'
import db from "@/lib/db";
import User from "@/lib/db/models/User";
import Test from "@/lib/db/models/Test";
import Client from "@/lib/db/models/Client";
import bcryptjs from "bcryptjs";
import { signIn,auth } from "@/auth";
import CryptoJS from "crypto-js";
import Filter from "@/lib/db/models/Filter";
import System from "@/lib/db/models/System";
import AdminActivity from "@/lib/db/models/AdminActivity";
import moment from "moment";

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
        const sess = await signIn("credentials",{email,password,redirect:false});
        // const {user} = await auth();
        // const activity = new AdminActivity({
        //     name:"SYSTEM LOGIN",
        //     activity : {
        //         admin: user.name,
        //         adminId: user._id,
        //         action: `Logged in at ${new Date()}`
        //     },
        //     date:Date.now()
        // })
        // await activity.save();
        return {status:200};
    }catch(error){
        return {message:error.message,status:500};
    }
    
}
export const getLoginDefaults = async () => {
    try {
        await db.connect();
        const system = await System.findOne().select("googleSignIn adminAccounts");
        const users = await User.collection.countDocuments();
        return ({status:200,system,users});
    } catch (error) {
        return ({status:500,error:error.message})
    }
}
export const sendResetLink = async (email) => {
    try{
        
    }catch(error){
        return {message:error.message,status:500};
    }
    
}

export const createClientForm = async (firstName,lastName,phoneNumber,residence,contactName,contactCell,dateOfInstallation) => {
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
            },
            dateOfInstallation
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
                dateOfInstallation: client.dateOfInstallation.toDateString()
            }
            serClients.push(serialized);
        })
       return (serClients);
        
    } catch (error) {
        return {error:error.message};
    }
}

export const saveFilterInfo = async ({clientId, clientName, u3, pc, ro, rc, changeCycle, changeCycleIndex, adminComments, filtersChanged, filterChangeHistory}) => {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin", status:403};
        }
        await db.connect();
        const client = await Client.findById(clientId);
        
        // Find the most recent filter for this client
        const lastFilter = await Filter.findOne({clientId: clientId}).sort({createdAt: -1});
        // If there's a previous filter, update its status
        if(lastFilter) {
            // Create an array to hold updated status entries
            const updatedStatus = [];
            // Check each filter type and update status appropriately
            const filterTypes = ["u3", "ro", "pc", "rc"];
            const newDates = [u3, ro, pc, rc];
            
            filterTypes.forEach((filterType, index) => {
                const oldDateField = `${filterType}_ChangeDate`;
                const oldDate = lastFilter[oldDateField];
                const newDate = newDates[index];
                
                // If dates are different, mark the old one as "Replaced"
                // Otherwise, keep as "Active"
                updatedStatus.push({
                    filterName: filterType,
                    status: newDate.toString() !== oldDate.toString() ? "Replaced" : "Active"
                });
            });
            
            // Update the previous filter's status
            await Filter.findByIdAndUpdate(lastFilter._id, {
                status: updatedStatus
            });
        }
        
        // Create new filter entry
        const filterInfo = new Filter({
            clientId,
            u3_ChangeDate: u3,
            ro_ChangeDate: ro,
            pc_ChangeDate: pc,
            rc_ChangeDate: rc,
            changeCycle,
            changeCycleIndex,
            filtersChanged,
            filterChangeHistory,
            adminId: user._id,
            comments: adminComments,
            status: [
                { filterName: "u3", status: "Active" },
                { filterName: "ro", status: "Active" },
                { filterName: "pc", status: "Active" },
                { filterName: "rc", status: "Active" }
            ]
        });
        
        await filterInfo.save();
        
        // Log admin activity
        const activity = new AdminActivity({
            name: "CLIENT FILTER REGISTRATION",
            activity: {
                admin: user.name,
                adminId: user._id,
                action: `Registered filters for ${client.firstName} ${client.lastName}`
            },
            date: Date.now()
        });
        
        await activity.save();
        
        return {status: 201, message: `Filter information for ${clientName} saved successfully`};
    } catch (error) {
        console.log(error.message);
        return {status: 500, message: error.message};
    }
}
export const getFilterData = async (id) => {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const filterData = await Filter.find({clientId:id});
        const serialized = [];
        filterData.forEach(filter => {
            const serializedFilter = {
                _id: filter._id.toString(),
                createdAt: filter.createdAt.toDateString(),
                updatedAt: filter.updatedAt.toDateString(),
                u3_ChangeDate: filter.u3_ChangeDate.toDateString(),
                ro_ChangeDate : filter.ro_ChangeDate.toDateString(),
                pc_ChangeDate : filter.pc_ChangeDate.toDateString(),
                rc_ChangeDate : filter.rc_ChangeDate.toDateString(),
                changeCycle:filter.changeCycle,
                changeCycleIndex:filter.changeCycleIndex,
                filtersChanged:filter.filtersChanged,
                adminId:filter.adminId,
                comments:filter.comments,
            }
            serialized.push(serializedFilter);
        })
        return {data:serialized};
       
    } catch (error) {
        return {status:500, message:error}
    }
}

export const saveTestInfo = async (florideTest, otherTests,clientID,) => {
    console.log(florideTest,otherTests,clientID);   
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const client = await Client.findById(clientID);
        const testInfo =  new Test({
            clientId : clientID,
            testResults:
                {
                    florideTest,
                    otherTest:otherTests,
                }
        });
        await testInfo.save();
        const activity = new AdminActivity({
            name:"CLIENT TEST DOCUMENTATION",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Saved Test results for ${client.firstName} ${client.lastName}`
            },
            date:Date.now()
        })
        await activity.save();
        return {status:201,message:`Test results for ${client.firstName} ${client.lastName} saved succesfully`}
        
    } catch (error) {
        return {status:500, message:error.message}
    }
}

export const editClientData = async({clientId,firstName,lastName,phoneNumber,county,residence,contactName,contactCell,doi})=> {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        console.log(doi);
        await db.connect();
        const client = await Client.findById(clientId);
        await client.updateOne({
            firstName:firstName,
            lastName:lastName,
            phoneNumber:phoneNumber,
            county:county,
            residence:residence,
            "contactPerson.name":contactName,
            "contactPerson.phoneNumber":contactCell,
            dateOfInstallation:doi
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


export const editFilterData = async({clientId,u3_ChangeDate,ro_ChangeDate,pc_ChangeDate,rc_ChangeDate})=> {
    try {
        const {user} = await auth();
        if(!user){
            return {message:"This operation is only possible if you are logged in as an admin",status:403};
        }
        await db.connect();
        const filter = await Filter.findOne({clientId});
        const client = await Client.findById(clientId);
        await filter.updateOne({
            u3_ChangeDate,ro_ChangeDate,pc_ChangeDate,rc_ChangeDate,
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
        const {user}  = await auth();
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
        const {user} = await auth();
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
        const {user} = await auth();
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
        const {user} = await auth();
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

export const editUserProfile = async(name,phoneNumber,bio,)=> {
    try {
        await db.connect();
        const {user} = await auth();
        await User.findByIdAndUpdate(user._id,{name,phoneNumber:Number(phoneNumber),bio});
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

export const changeProfilePic = async(uploadedPic)=> {
    try {
        const {user} = await auth();
        await db.connect();
        await User.findByIdAndUpdate(user._id,{image:uploadedPic});
        const activity = new AdminActivity({
            name:"UPDATE ADMIN PROFILE PICTURE",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Changed profile profile for ${user.name}`
            },
            date:Date.now()
        })
        await activity.save();
        await db.disconnect();
        return{status:201};
    } catch (error) {
        return {status:500,error:error.message}
    }
}

//dashboard/clients (with pagination)
export const getClients2 = async (pageNum,limit) => {
   
    const skip = (pageNum - 1) * limit
    try {
        await db.connect();
        const numClients =  await Client.countDocuments();
       const result =  await Client.find({}).limit(Number(limit)).skip(Number(skip));
       const serClients = [];
       result.forEach(client => {
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
        serClients.push(serialized)
        }
        )
        return {clients : serClients, numClients}
    } catch (error) {
        return error.message
    }
}
//dashboard/clients (with pagination by year)
export const getClients3 = async (year) => {

    try {
        await db.connect();
       const result =  await Client.find({
         dateOfInstallation: {
           $gte: new Date(`${year}-01-01T00:00:00Z`),
           $lt: new Date(`${year + 1}-01-01T00:00:00Z`)
         }
       });
       const serClients = [];
       result.forEach(client => {
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
               dateOfInstallation: client.dateOfInstallation.toDateString()
           }
        serClients.push(serialized)
        }
        )
        return {clients : serClients, year}
    } catch (error) {
        return error.message
    }
}
// /dashboard/clients
export const searchClient = async (firstName) => {
    
    try {
        await db.connect();
        const numClients =  await Client.countDocuments();
        const result =  await Client.find({firstName:{ $regex: firstName.trim(), $options: "i" }});
       const serClients = [];
       result.forEach(client => {
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
        serClients.push(serialized)
        })
        console.log(result,serClients);
        return {searchResults : serClients, numClients}
    } catch (error) {
        return error.message
    }
}
// /dashboard/clients/id/
export const getClientData = async(clientId)=> {

    try {
        const [client,filterInfo,testInfo] = await Promise.all([Client.findById(clientId), Filter.find({clientId}),Test.find({clientId})]);
        return {client,filterInfo,testInfo}
    } catch (error) {
        return {status:500,error:error.message}
    }
}

export const changeClientStatus = async(clientId,setStatus)=> {
    const {user} = await auth();
    try {
        const client = await Client.findById(clientId);
        await Client.updateOne({_id: clientId},{isActive:setStatus});
        const activity = new AdminActivity({
            name:"CHANGE CLIENT STATUS",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Changed status for ${client.firstName} ${client.lastName} to ${setStatus}`
            },
            date:Date.now()
        })
        await activity.save();
        return{status:200,message:`Status Change Operation was successfull. Account status is ${client.isActive ? "Active" : "Inactive"}`};
    } catch (error) {
        return {status:500,error:error.message}
    }
}

export const deleteClient = async(clientId,clientName)=> {
    const {user} = await auth();
    try {
        await Client.findByIdAndDelete(clientId);
        const activity = new AdminActivity({
            name:"DELETE CLIENT",
            activity : {
                admin: user.name,
                adminId: user._id,
                action: `Deleted account for ${clientName}`
            },
            date:Date.now()
        })
        await activity.save();
        return{status:200,message:`Permanently deleted ${clientName}'s account.`};
    } catch (error) {
        return {status:500,error:error.message}
    }
}