import React from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Image from "next/image";
import db from '@/lib/db';
import User from '@/lib/db/models/User';

async function AdminProfile({params}) {
  const id = params.id;
  await db.connect();
  const user = await User.findById(id);
  await db.disconnect();
  
  return (
    <DefaultLayout>
        <Breadcrumb pageName={"settings"} additonalRoute={"admin-profile"}/>
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-12 ">
            <div style={{backgroundImage:`url(${bg1.src})`, backgroundSize:"cover"}} className="flex flex-col h-screen items-center justify-around"></div>
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto  w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2">
                <Image src={`${user?.image ? user?.image : avatar.src }`} width={250} height={250} style={{  clipPath:"circle()", height: "auto",}} alt="profile"/>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
               { user?.name}
              </h3>
              <p className="font-medium">{user?.isSuperAdmin ?  "Root admin" : "sub admin"}</p>
              <p className="font-medium">Admin Since {user?.createdAt.toDateString() }</p>

              <div className="mx-auto max-w-180">
                <h4 className="font-semibold text-black dark:text-white">
                  About {user.name}
                </h4>
                <p className="mt-4.5">
                  {user?.bio ? user.bio : "No bio written"}
                </p>
              </div>
            </div>
          </div>
        </div>
    </DefaultLayout>
  )
}

export default AdminProfile