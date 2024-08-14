import mongoose from "mongoose";

const filterSchema = new mongoose.Schema(
    {
        clientId:{type:mongoose.Schema.Types.ObjectId,ref:"Client",required:true},
        sedimentFilter: {type:Boolean, required:true},
        u3_ChangeDate : {type:Date, required:true},
        ro_ChangeDate:{type:Date,default:false},
        pc_ChangeDate:{type:Date,default:false}, 
        rc_ChangeDate:{type:Boolean,default:false},
        changeHistory : [
            {
                adminId: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
                comments: {type:String,required:true},
                date: {type:Date}
            }
        ],
    },
    {
        timestamps:true
    }
) 

const Filter = mongoose.models?.Filter || mongoose.model("Filter",filterSchema);
export default Filter;