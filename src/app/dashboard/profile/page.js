import React from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import bg1 from "../../../../public/images/pattern2.png";
import avatar from "../../../../public/images/avatar.png";
import db from '@/lib/db'
import User from '@/lib/db/models/User';

async function Profile() {
  const session = await auth();
  await db.connect();
  const me = await User.findOne({email:session.user.email});
 
  return (
    <DefaultLayout>
        <Breadcrumb pageName={"profile"}/>
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-12 ">
            <div style={{backgroundImage:`url(${bg1.src})`, backgroundSize:"cover"}} className="flex flex-col h-screen items-center justify-around"></div>
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto  w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2">
                <Image src={`${me?.image ? me?.image : session?.user?.image ? session?.user?.image : avatar.src }`} width={250} height={250} style={{  clipPath:"circle()", height: "auto",}} alt="profile"/>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
               { me?.name}
              </h3>
              <div className="mx-auto mb-5.5 mt-4.5 grid w-fit grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="text-sm">Role:</span>
                  <span className="font-semibold text-black dark:text-white">
                  {me?.isSuperAdmin ?  "Root admin" : "sub admin"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="text-sm">Since:</span>
                  <span className="font-semibold text-black dark:text-white">
                  {me?.createdAt?.toDateString() }
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="text-sm">Filter Changes:</span>
                  <span className="font-semibold text-black dark:text-white">
                    20
                  </span>
                </div>
              </div>
         
              <div className="mx-auto max-w-180">
                <h4 className="font-semibold text-black dark:text-white">
                  About Me
                </h4>
                <p className="mt-4.5">
                  {me?.bio ? me.bio : "No bio written"}
                </p>
              </div>
              <div className='flex'>
                <Link href="/dashboard/profile/edit" className=' relative z-30 rounded-md m-auto z-999 bg-blue-600 px-4 py-2 my-4 hover:opacity-90 flex w-fit text-white'>Edit profile</Link>
                <Link href="/dashboard/profile/change-password" className=' relative z-30 rounded-md m-auto z-999 bg-rose-600 px-4 py-2 my-4 hover:opacity-90 flex w-fit text-white'>Change password</Link>
              </div>

            </div>
          </div>
        </div>
    </DefaultLayout>
  )
}

export default Profile