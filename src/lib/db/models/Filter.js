import mongoose from "mongoose";

const filterSchema = new mongoose.Schema(
    {
        clientId:{type:mongoose.Schema.Types.ObjectId,ref:"Client",required:true},
        preFilter: {type:Boolean, required:true},
        u3_ChangeDate : {type:Date, required:true},
        ro_ChangeDate:{type:Date,required:true},
        pc_ChangeDate:{type:Date,required:true}, 
        rc_ChangeDate:{type:Date,required:true},
        changeCycle: {type:String,required:true},
        adminId: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        comments: {type:String},
    },
    {
        timestamps:true
    }
) 

const Filter = mongoose.models?.Filter || mongoose.model("Filter",filterSchema);
export default Filter;