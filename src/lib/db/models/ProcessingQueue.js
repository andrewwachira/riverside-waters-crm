// ProcessingQueue.js
import mongoose from "mongoose";

const processingQueueSchema = new mongoose.Schema(
    {
        filterId: {type: mongoose.Schema.Types.ObjectId, ref: "Filter"},
        notificationId: {type: mongoose.Schema.Types.ObjectId, ref: "Notification"},
        taskType: {
            type: String, 
            enum: ["StatusUpdate", "NotificationCheck", "NotificationRetry"],
            required: true
        },
        status: {
            type: String, 
            enum: ["Pending", "Processing", "Completed", "Failed"],
            default: "Pending"
        },
        priority: {type: Number, default: 2}, // 1=highest, 3=lowest
        processingStartedAt: {type: Date},
        processingCompletedAt: {type: Date},
        error: {type: String},
        attempts: {type: Number, default: 0},
        result: {type: mongoose.Schema.Types.Mixed}
    },
    {
        timestamps: true
    }
);

// Create indexes for efficient querying
processingQueueSchema.index({ status: 1, priority: 1, createdAt: 1 });
processingQueueSchema.index({ filterId: 1, taskType: 1, status: 1 });
processingQueueSchema.index({ notificationId: 1 });

const ProcessingQueue = mongoose.models?.ProcessingQueue || mongoose.model("ProcessingQueue", processingQueueSchema);
export default ProcessingQueue;