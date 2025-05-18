// vercel-cron-job.js
// This file is designed for Vercel Cron Jobs with 10s timeout constraints

import db from '@/lib/db';
import Filter from '@/lib/db/models/Filter';
import Notification from '@/lib/db/models/Notification';

/**
 * Main handler for Vercel cron job
 * Instead of processing everything at once, this identifies work to be done
 * and queues it for background processing
 */
export default async function handler(req, res) {
    try {
        // Quick validation that this is being called by Vercel cron
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        
        // Verify the cron job signature if needed
        // const signature = req.headers['x-vercel-cron-signature'];
        // if (!verifySignature(signature)) {
        //    return res.status(401).json({ error: 'Unauthorized' });
        // }
        
        console.log('Starting filter status check job');
        const startTime = Date.now();
        
        // Connect to the database
        await db.connect();
        
        // Current date references
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        oneMonthFromNow.setHours(0, 0, 0, 0);
        
        // STEP 1: Queue filter status updates for past due filters
        // This just marks filters for updating, doesn't do the actual updates
        const filtersToUpdate = await Filter.find({
            status: {
                $elemMatch: {
                    status: 'Active'
                }
            },
            $or: [
                { u3_ChangeDate: { $lt: today } },
                { ro_ChangeDate: { $lt: today } },
                { pc_ChangeDate: { $lt: today } },
                { rc_ChangeDate: { $lt: today } }
            ]
        }).select('_id').lean();
        
        console.log(`Found ${filtersToUpdate.length} filters to update status`);
        
        // Create a processing queue entry for each filter that needs updating
        // This just creates tasks, doesn't do the actual processing
        const updateQueue = filtersToUpdate.map(filter => ({
            filterId: filter._id,
            taskType: 'StatusUpdate',
            status: 'Pending',
            createdAt: new Date(),
            priority: 1 // Higher priority than notifications
        }));
        
        // STEP 2: Queue notification creation for filters due in one month
        // Find filters with any date close to one month from now
        const monthWindow = 2; // 2 days window to account for varying month lengths
        const filtersForNotification = await Filter.find({
            status: { 
                $elemMatch: { 
                    status: 'Active' 
                } 
            },
            $or: [
                { 
                    u3_ChangeDate: { 
                        $gte: new Date(oneMonthFromNow.getTime() - monthWindow * 24 * 60 * 60 * 1000),
                        $lte: new Date(oneMonthFromNow.getTime() + monthWindow * 24 * 60 * 60 * 1000)
                    } 
                },
                { 
                    ro_ChangeDate: { 
                        $gte: new Date(oneMonthFromNow.getTime() - monthWindow * 24 * 60 * 60 * 1000),
                        $lte: new Date(oneMonthFromNow.getTime() + monthWindow * 24 * 60 * 60 * 1000)
                    } 
                },
                { 
                    pc_ChangeDate: { 
                        $gte: new Date(oneMonthFromNow.getTime() - monthWindow * 24 * 60 * 60 * 1000),
                        $lte: new Date(oneMonthFromNow.getTime() + monthWindow * 24 * 60 * 60 * 1000)
                    } 
                },
                { 
                    rc_ChangeDate: { 
                        $gte: new Date(oneMonthFromNow.getTime() - monthWindow * 24 * 60 * 60 * 1000),
                        $lte: new Date(oneMonthFromNow.getTime() + monthWindow * 24 * 60 * 60 * 1000)
                    } 
                }
            ]
        }).select('_id').lean();
        
        console.log(`Found ${filtersForNotification.length} filters for notification checks`);
        
        // Create a processing queue entry for each filter that needs notification
        const notificationQueue = filtersForNotification.map(filter => ({
            filterId: filter._id,
            taskType: 'NotificationCheck',
            status: 'Pending',
            createdAt: new Date(),
            priority: 2 // Lower priority than status updates
        }));
        
        // Step 3: Add retry tasks for failed notifications
        // Find notifications that need retry
        const failedNotifications = await Notification.find({
            status: 'Failed',
            retryCount: { $lt: 3 },
            nextRetryAt: { $lte: new Date() }
        }).select('_id').limit(100).lean(); // Limit to avoid too many items
        
        console.log(`Found ${failedNotifications.length} failed notifications for retry`);
        
        // Create processing queue entries for retry attempts
        const retryQueue = failedNotifications.map(notification => ({
            notificationId: notification._id,
            taskType: 'NotificationRetry',
            status: 'Pending',
            createdAt: new Date(),
            priority: 3 // Lowest priority
        }));
        
        // Combine all queue items
        const processingQueue = [...updateQueue, ...notificationQueue, ...retryQueue];
        
        // Save all queued tasks to the database
        if (processingQueue.length > 0) {
            await ProcessingQueue.insertMany(processingQueue);
            console.log(`Queued ${processingQueue.length} tasks for background processing`);
        }
        
        const elapsed = Date.now() - startTime;
        console.log(`Cron job completed in ${elapsed}ms`);
        
        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: 'Tasks queued successfully',
            stats: {
                filtersToUpdate: filtersToUpdate.length,
                filtersForNotification: filtersForNotification.length,
                failedNotifications: failedNotifications.length,
                totalTasks: processingQueue.length,
                executionTime: `${elapsed}ms`
            }
        });
    } catch (error) {
        console.error('Error in cron job:', error);
        return res.status(500).json({ 
            error: 'Cron job execution failed',
            message: error.message
        });
    } finally {
        // Ensure database connection is closed
        try {
            await db.disconnect();
        } catch (err) {
            console.error('Error closing database connection:', err);
        }
    }
}