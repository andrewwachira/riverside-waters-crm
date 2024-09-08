import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import db from '@/lib/db';
import Client from '@/lib/db/models/Client';
import Filter from '@/lib/db/models/Filter';
import Test from '@/lib/db/models/Test';
import Link from 'next/link';
import { getDateDiff } from '@/lib/utils';

async function Clients({params}) {
  
  await db.connect();
  const client = await Client.findById(params.id);
  const filterInfo = await Filter.findOne({clientId:params.id});

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Clients" additonalRoute={client.firstName}/>
      <h1 className="text-center text-5xl my-5 ">{client.firstName + " " + client.lastName}</h1>
      <div className="">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 mb-7 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white"> Client Details</h4>
          <div className="flex w-full">
            <div className="grid grid-row-5  rounded-sm bg-gray-2 dark:bg-meta-4 w-full">
              <div className="p-2.5 border-b border-stroke ">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Name
                </h5>
              </div>
              <div className="p-2.5 border-b border-stroke">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Phone number
                </h5>
              </div>
              <div className="p-2.5 border-b border-stroke">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Residence
                </h5>
              </div>
              <div className=" p-2.5 border-b border-stroke">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Contact Person
                </h5>
              </div>
            
              <div className=" p-2.5 border-b border-stroke">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Contact&apos;s Cell
                </h5>
              </div>
            </div> 
            <div className={`grid grid-rows-5 dark:border-strokedark w-full`} >
              <div className="border-b border-stroke flex tems-center justify-center p-2.5">
                <p className=" text-black dark:text-white sm:block">{client.firstName + " " + client.lastName}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client.phoneNumber}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black">{client.residence}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client.contactPerson?.name}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client.contactPerson?.phoneNumber}</p>
              </div>
            </div>
          </div>
          <Link href={`/dashboard/clients/${client._id}/edit-client-info`} className="flex w-full justify-center rounded bg-primary p-3 my-5 font-medium text-white hover:bg-opacity-90">Edit Client Details</Link>

        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 mb-7 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <div className='flex justify-between items-center mb-4'>
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white"> Filter Information</h4>
            <div className='flex'>
              <span className='text-rose-600 mx-1'>{`< 7 days`}</span> | 
              <span className='text-orange-500 mx-1'>{`< 21 days`}</span> |
              <span className='text-meta-3 mx-1'>{`> 3 weeks`}</span>
            </div>
          </div>
         
          <div className="flex w-full">
              <div className="grid grid-row-5 rounded-sm bg-gray-2 dark:bg-meta-4 w-full">
                <div className="p-2.5 border-b border-stroke ">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Sediment Filter present</h5>
                </div>
                <div className="p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Ultra 3 Change Date</h5>
                </div>
                <div className="p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium uppercase xsm:text-base"> Reverse Osmosis Change date </h5>
                </div>
                <div className=" p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Post Carbon Change date</h5>
                </div>
                <div className=" p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Remineralizing Cartilage </h5>
                </div>
              </div> 

              <div className={`grid grid-rows-5 dark:border-strokedark w-full`} >
                <div className="border-b border-stroke flex tems-center justify-center p-2.5">
                  <p className={`text-black dark:text-white sm:block`}>{filterInfo?.sedimentFilter ? "Yes" : "No"}</p>
                </div>
                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className={`text-black dark:text-white ${getDateDiff(filterInfo?.u3_ChangeDate) < 7 ? "text-rose-600" : getDateDiff(filterInfo?.u3_ChangeDate) < 21 ? "text-orange-500" : "text-meta-3"}`}>{(filterInfo?.u3_ChangeDate)?.toDateString()}</p>
                </div>
                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className={`text-black dark:text-white ${getDateDiff(filterInfo?.u3_ChangeDate) < 7 ? "text-rose-600" : getDateDiff(filterInfo?.u3_ChangeDate) < 21 ? "text-orange-500" : "text-meta-3"}`}>{(filterInfo?.ro_ChangeDate)?.toDateString()}</p>
                </div>
                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className={`text-black dark:text-white ${getDateDiff(filterInfo?.u3_ChangeDate) < 7 ? "text-rose-600" : getDateDiff(filterInfo?.u3_ChangeDate) < 21 ? "text-orange-500" : "text-meta-3"}`}>{(filterInfo?.pc_ChangeDate)?.toDateString()}</p>
                </div>
                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className={`text-black dark:text-white ${getDateDiff(filterInfo?.u3_ChangeDate) < 7 ? "text-rose-600" : getDateDiff(filterInfo?.u3_ChangeDate) < 21 ? "text-orange-500" : "text-meta-3"}`}>{(filterInfo?.rc_ChangeDate)?.toDateString()}</p>
                </div>
              </div>
            </div>
            <Link href={`/dashboard/clients/${client._id}/edit-filter-info`}  className="flex w-full justify-center rounded bg-primary p-3 my-5 font-medium text-white hover:bg-opacity-90">Edit Filter Information</Link>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white"> Test Information</h4>
            <div className='flex w-full'>
              <div className="w-full border border-rose-600 rounded-md m-auto mx-4 mb-4 text-center my-3 bg-rose-200 p-3 text-rose-800">No Test Details Yet</div>
            </div>
        </div >
    </div>
    </DefaultLayout>
  )
}

export default Clients