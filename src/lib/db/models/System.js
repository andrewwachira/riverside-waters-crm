import mongoose from "mongoose";

const systemSchema = new mongoose.Schema(
    {
        googleSignIn:{type:Boolean, required:false, default:false},
        rootAdmin: {
            name: {type:String},
            email: {type:String},
            password: {type:String}
        },
        adminAccounts:{type:Number, required:true, default: 2},
    },
    {
        timestamps:true
    }
) 

const System = mongoose.models?.System || mongoose.model("System",systemSchema);
export default System;