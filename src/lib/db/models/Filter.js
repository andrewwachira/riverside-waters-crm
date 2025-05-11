import mongoose from "mongoose";

const filterSchema = new mongoose.Schema(
    {
        clientId:{type:mongoose.Schema.Types.ObjectId,ref:"Client",required:true},
        u3_ChangeDate : {type:Date, required:true},
        ro_ChangeDate:{type:Date,required:true},
        pc_ChangeDate:{type:Date,required:true}, 
        rc_ChangeDate:{type:Date,required:true},
        changeCycle: {type:String,required:true},
        changeCycleIndex: {type:Number,required:true},
        filtersChanged:[{type:String,required:true}],
        filterChangeHistory:[
            {
                filterName:{type:String,required:true},
                prevDate:{type:Date,required:true},
                nextDate:{type:Date,required:true},
             }],

        adminId: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        comments: {type:String},
    },
    {
        timestamps:true
    }
) 

const Filter = mongoose.models?.Filter || mongoose.model("Filter",filterSchema);
export default Filter;