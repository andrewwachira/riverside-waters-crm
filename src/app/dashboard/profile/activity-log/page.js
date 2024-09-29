import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'
import AdminActivity from '@/lib/db/models/AdminActivity';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { auth } from '@/auth';

async function ActivityLog() {
    const user  = await auth();
    const activities = await AdminActivity.find({"activity.admin":user.user.name});
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Activity Log" />    
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

            { activities?.length < 1 ? 
            <div className='rounded-md border border-rose-500 mb-5 w-full bg-rose-200'>
                <p className='p-5 text-center text-lg text-rose-700'>You have not had any activitiies  yet.</p>
            </div>
            :
            <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 md:grid-cols-5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Activity Name</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Admin</h5>
                    </div>
                    <div className="hidden p-2.5 text-center xl:p-5 md:block">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Action</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
                    </div>
            </div>

            {activities.map((activity, key) => (
                <div className={`grid grid-cols-3 sm:grid-cols-5 ${ key === activities.length - 1 ? "" : "border-b border-stroke dark:border-strokedark" }`} key={key}>
                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                        <p className="text-black dark:text-white sm:block">{activity?.name}</p>
                    </div>

                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                        <p className="text-black dark:text-white">{activity?.activity?.admin}</p>
                    </div>

                    <div className="hidden items-center justify-center md:block p-2.5 xl:p-5">
                        <p className="text-black text-center dark:text-white">{activity.activity?.action}</p>
                    </div>

                    <div className="hidden items-center justify-center p-2.5 md:block xl:p-5">
                        <p className="text-black text-center dark:text-white">{activity?.date.toDateString()}</p>
                    </div>
                </div>
            ))}
            </div>
            }
        </div>
        <div className='h-[50vh]'></div>
        </DefaultLayout>
  )
}

export default ActivityLog;