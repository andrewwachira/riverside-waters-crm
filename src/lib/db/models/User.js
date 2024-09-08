import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true, unique: true},
        password: {type:String, required:true},
        phoneNumber : {type:Number, required:true,unique:true},
        isSuperAdmin:{type:Boolean,default:false},
        isSubAdmin:{type:Boolean,default:false}, 
        isAuthenticated:{type:Boolean,default:false},
        image:{type:String},
        bio:{type:String},
    },
    {
        timestamps:true
    }
) 

const User = mongoose.models?.User || mongoose.model("User",userSchema);
export default User;