import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        firstName:{type:String, required:true},
        lastName:{type:String, required:true},
        phoneNumber : {type:String, required:true,unique:true},
        residence:{type:String,required:true},
        contactPerson:{
            name: {type:String},
            phoneNumber:{type:String}
        }, 
    },
    {
        timestamps:true
    }
) 

const Client = mongoose.models?.Client || mongoose.model("Client",clientSchema);
export default Client;