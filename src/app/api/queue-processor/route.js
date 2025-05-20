// This API route processes items from the queue when called
// It should be called by a separate process or service
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import ProcessingQueue from '@/lib/db/models/ProcessingQueue';
import Filter from '@/lib/db/models/Filter';
import Notification from '@/lib/db/models/Notification';
import { sendSMS } from '@/lib/utils/notificationService';

// Maximum execution time for this handler (in ms)
// Keep well below Vercel's function timeout (60s for Pro plans)
const MAX_EXECUTION_TIME = 50000; // 50 seconds

export async function POST(req) {
    const startTime = Date.now();
    let processedCount = 0;
    
    try {
        // Connect to database
        await db.connect();
        
        // Process queue items until we're close to timeout or no more items
        let keepProcessing = true;
        
        while (keepProcessing) {
            // Check if we're approaching our time limit
            if (Date.now() - startTime > MAX_EXECUTION_TIME) {
                console.log('Approaching execution time limit, stopping processing');
                break;
            }
            
            // Find and claim the next task with highest priority
            const task = await ProcessingQueue.findOneAndUpdate(
                { status: 'Pending' },
                  { 
                    $set: {
                        status: 'Processing',
                        processingStartedAt: new Date()
                    },
                    $inc: { attempts: 1 }
                },
                { 
                    sort: { priority: 1, createdAt: 1 },
                    new: true 
                }
            );
            
            // If no more tasks, we're done
            if (!task) {
                console.log('No more pending tasks');
                keepProcessing = false;
                break;
            }
            
            console.log(`Processing task: ${task._id}, type: ${task.taskType}`);
            
            try {
                // Process the task based on its type
                switch (task.taskType) {
                    case 'StatusUpdate':
                        await processStatusUpdate(task);
                        break;
                    case 'NotificationCheck':
                        await processNotificationCheck(task);
                        break;
                    case 'NotificationRetry':
                        await processNotificationRetry(task);
                        break;
                    default:
                        throw new Error(`Unknown task type: ${task.taskType}`);
                }
                
                // Mark task as completed
                task.status = 'Completed';
                task.processingCompletedAt = new Date();
                await task.save();
                
                processedCount++;
            } catch (error) {
                console.error(`Error processing task ${task._id}:`, error);
                
                // Mark task as failed
                task.status = 'Failed';
                task.error = error.message;
                await task.save();
            }
        }
        
        return NextResponse.json({
            success: true,
            processed: processedCount,
            executionTime: `${Date.now() - startTime}ms`
        });
    } catch (error) {
        console.error('Error in queue processor:', error);
        return NextResponse.json({ 
            error: 'Queue processing failed',
            message: error.message
        }, { status: 500 });
    } finally {
        // Ensure database connection is closed
        try {
           await db.disconnect();
        } catch (err) {
            console.error('Error closing database connection:', err);
        }
    }
}

/**
 * Process a status update task - update filter status for past due filters
 */
async function processStatusUpdate(task) {
    const filter = await Filter.findById(task.filterId);
    if (!filter) {
        throw new Error(`Filter not found: ${task.filterId}`);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let statusChanged = false;
    const updatedStatus = [...filter.status];
    
    // Check each filter type's date
    const filterTypes = [
        { name: 'u3', dateField: 'u3_ChangeDate' },
        { name: 'ro', dateField: 'ro_ChangeDate' },
        { name: 'pc', dateField: 'pc_ChangeDate' },
        { name: 'rc', dateField: 'rc_ChangeDate' }
    ];
    
    // Go through each filter type and check if it's past due
    for (const filterType of filterTypes) {
        const changeDate = new Date(filter[filterType.dateField]);
        changeDate.setHours(0, 0, 0, 0);
        
        // Find the status object for this filter type
        const statusIndex = updatedStatus.findIndex(s => s.filterName === filterType.name);
        
        // Only update if it's currently Active and it's past due
        if (statusIndex !== -1 && 
            updatedStatus[statusIndex].status === 'Active' && 
            changeDate < today) {
            
            updatedStatus[statusIndex].status = 'Past Due';
            statusChanged = true;
        }
    }
    
    // If any status was changed, update the document
    if (statusChanged) {
        await Filter.findByIdAndUpdate(filter._id, { status: updatedStatus });
        return { updated: true, changes: updatedStatus };
    }
    
    return { updated: false };
}

/**
 * Process a notification check task - check if notification needs to be sent
 */
async function processNotificationCheck(task) {
    // Fetch the filter with client information
    const filter = await Filter.findById(task.filterId).populate('clientId');
    if (!filter || !filter.clientId) {
        throw new Error(`Filter not found or client not associated: ${task.filterId}`);
    }
    
    const client = filter.clientId;
    // Skip if no client phone number
    if (!client.phoneNumber) {
        return { skipped: true, reason: 'No client phone number' };
    }
    
    // Calculate one month from now
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    oneMonthFromNow.setHours(0, 0, 0, 0);
    
    // Check if we've already sent this notification recently (in the past 7 days)
    const existingNotification = await Notification.findOne({
        clientId: client._id,
        filterId: filter._id,
        notificationType: 'FilterDueReminder',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    // Skip if we've already notified this client about these filters recently
    if (existingNotification) {
        return { skipped: true, reason: 'Recent notification exists' };
    }
    
    // Track filters due in a month for notification
    const filtersDueInMonth = [];
    
    // Check each filter type's date
    const filterTypes = [
        { name: 'u3', dateField: 'u3_ChangeDate', friendlyName: 'Ultra 3 filter' },
        { name: 'ro', dateField: 'ro_ChangeDate', friendlyName: 'Reverse Osmosis' },
        { name: 'pc', dateField: 'pc_ChangeDate', friendlyName: 'Post Carbon' },
        { name: 'rc', dateField: 'rc_ChangeDate', friendlyName: 'Remineralysing Cartilage' }
    ];
    
    // Go through each filter type and check if it's due in a month
    for (const filterType of filterTypes) {
        const changeDate = new Date(filter[filterType.dateField]);
        changeDate.setHours(0, 0, 0, 0);
        
        // Find the status object for this filter type
        const statusIndex = filter.status.findIndex(s => s.filterName === filterType.name);
        
        // Skip if not active
        if (statusIndex === -1 || filter.status[statusIndex].status !== 'Active') {
            continue;
        }
        
        // Check if filter will be due in a month
        // Compare the dates (within 2 days of a month from now)
        const monthDiff = Math.abs((changeDate.getTime() - oneMonthFromNow.getTime()) / (1000 * 3600 * 24));
        if (monthDiff <= 2) { // Within 2 days of the target date
            filtersDueInMonth.push({
                filterName: filterType.name,
                friendlyName: filterType.friendlyName,
                dueDate: changeDate
            });
        }
    }
    
    // If any filters are due in a month, send notification
    if (filtersDueInMonth.length > 0) {
        // Create notification message
        const filtersText = filtersDueInMonth.map(f => 
            `${f.friendlyName} filter (due on ${f.dueDate.toLocaleDateString()})`
        ).join(', ');
        
        const message = `Dear ${client.firstName}, this is a reminder that the following filters will need replacement in approximately one month: ${filtersText}. Please contact us to schedule a replacement.`;
        const adminMessage = `Dear Admin, this is a reminder that the following filters belonging to ${client.firstName} will need replacement in approximately one month: ` + filtersText;
        // Create notification record in database first (with Pending status)
        const notification = new Notification({
            clientId: client._id,
            filterId: filter._id,
            type: 'SMS',
            channel: client.phoneNumber,
            message: message,
            status: 'Pending',
            notificationType: 'FilterDueReminder',
            filtersIncluded: filtersDueInMonth
        });
        
        await notification.save();
        
        // Send SMS notification
        try {
            const result = await sendSMS(["0729302487"], message);
            await sendEmail("riversidewaterlimited@gmail.com",`Filter Change for ${client.firstName} ${client.lastName} Notification`, adminMessage);
            // Update notification record with success status
            notification.status = 'Sent';
            notification.responseData = result;
            notification.sentAt = new Date();
            await notification.save();
            
            return { sent: true, notificationId: notification._id };
        } catch (error) {
            console.error(`Failed to send SMS to ${client.phoneNumber}:`, error);
            
            // Update notification record with failed status
            notification.status = 'Failed';
            notification.responseData = { error: error.message };
            notification.retryCount += 1;
            notification.nextRetryAt = new Date(Date.now() + 4 * 60 * 60 * 1000); // Try again in 4 hours
            await notification.save();
            
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }
    
    return { skipped: true, reason: 'No filters due in a month' };
}

/**
 * Process a notification retry task
 */
async function processNotificationRetry(task) {
    const notification = await Notification.findById(task.notificationId).populate('clientId');
    
    if (!notification) {
        throw new Error(`Notification not found: ${task.notificationId}`);
    }
    
    if (!notification.clientId) {
        // Client might have been deleted, mark as failed permanently
        notification.status = 'Failed';
        notification.nextRetryAt = null;
        await notification.save();
        return { skipped: true, reason: 'Client not found' };
    }
    
    // Attempt to resend based on notification type
    if (notification.type === 'SMS') {
        const result = await sendSMS(notification.channel, notification.message);
        
        // Update with success information
        notification.status = 'Sent';
        notification.responseData = result;
        notification.sentAt = new Date();
        notification.nextRetryAt = null;
        await notification.save();
        
        return { sent: true, retried: true };
    } else if (notification.type === 'Email' && notification.subject) {
        // Add email sending logic if needed
        throw new Error('Email sending not implemented');
    } else {
        throw new Error(`Unsupported notification type: ${notification.type}`);
    }
}