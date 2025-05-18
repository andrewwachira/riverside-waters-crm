import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        clientId: {type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true},
        filterId: {type: mongoose.Schema.Types.ObjectId, ref: "Filter", required: true},
        type: {type: String, enum: ["SMS", "Email"], required: true},
        channel: {type: String, required: true}, // Phone number or email address
        message: {type: String, required: true},
        subject: {type: String}, // For email notifications
        status: {type: String, enum: ["Pending", "Sent", "Failed"], default: "Pending"},
        responseData: {type: mongoose.Schema.Types.Mixed}, // Store response from notification service
        notificationType: {
            type: String, 
            enum: ["FilterDueReminder", "FilterPastDue", "FilterReplaced", "Other"],
            required: true
        },
        filtersIncluded: [{
            filterName: {type: String, required: true}, // u3, ro, pc, rc
            dueDate: {type: Date, required: true},
            friendlyName: {type: String, required: true} // Human-readable name
        }],
        readByClient: {type: Boolean, default: false}, // For future use (e.g., if implementing a client portal)
        sentAt: {type: Date},
        retryCount: {type: Number, default: 0},
        nextRetryAt: {type: Date}
    },
    {
        timestamps: true
    }
);

// Create indexes for efficient querying
notificationSchema.index({ clientId: 1, filterId: 1, notificationType: 1, createdAt: -1 });
notificationSchema.index({ status: 1, nextRetryAt: 1 }); // For retry processing

const Notification = mongoose.models?.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;