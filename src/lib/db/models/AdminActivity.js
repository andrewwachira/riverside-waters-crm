import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
    {
        name:{type:String, required:true},
        activity : {
            admin: {type:String},
            adminId: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
            action: {type:String},
            
        },
        date:{type:Date,required:true}
    },
    {
        timestamps:true
    }
) 

const AdminActivity = mongoose.models.AdminActivity || mongoose.model("AdminActivity",adminActivitySchema);
export default AdminActivity;