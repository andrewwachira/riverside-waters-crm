import mongoose from "mongoose";

const filterSchema = new mongoose.Schema(
    {
        clientId:{type:mongoose.Schema.Types.ObjectId,ref:"Client",required:true},
        sedimentFilter: {type:Boolean, required:true},
        u3_ChangeDate : {type:Date, required:true},
        ro_ChangeDate:{type:Date,required:true},
        pc_ChangeDate:{type:Date,required:true}, 
        rc_ChangeDate:{type:Date,required:true},
        changeHistory : [
            {
                adminId: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
                comments: {type:String},
                previousDates : [
                    {
                        u3 : {type:Date},
                        ro :{type:Date},
                        pc :{type:Date}, 
                        rc :{type:Date},
                    }
                ],
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