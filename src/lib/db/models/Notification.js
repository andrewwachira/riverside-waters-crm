import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        clientId:{type:mongoose.Schema.Types.ObjectId,ref:"Client",required:true},
        filterId: {type:mongoose.Schema.Types.ObjectId,ref:"Filter",required:true},
        notificationHistory : [
            {
                notificationToClient: {type:Boolean,required:true},
                notificationToAdmin: {type:Boolean,required:true},
                date: {type:Date, required:true},
                notification: {type:String,}
            }
        ],
    },
    {
        timestamps:true
    }
) 

const Notification = mongoose.models?.Notification || mongoose.model("Notification",notificationSchema);
export default Notification;



