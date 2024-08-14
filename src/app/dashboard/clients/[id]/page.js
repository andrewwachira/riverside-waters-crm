import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import db from '@/lib/db';
import Client from '@/lib/db/models/Client';
import Filter from '@/lib/db/models/Filter';
import Test from '@/lib/db/models/Test';
import Link from 'next/link';


async function Clients({params}) {
  
  await db.connect();
  const client = await Client.findById(params.id);
  const filterInfo = await Filter.findOne({clientId:params.id});
  console.log(client,filterInfo);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Clients"/>
      <h1 className="text-center text-3xl my-4">{client.firstName + " " + client.lastName}</h1>
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
                  Contact Person Cell
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
                <p className="text-meta-3">{client.residence}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client.contactPerson?.name}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client.contactPerson?.phoneNumber}</p>
              </div>
            </div>
          </div>
          <button className="flex w-full justify-center rounded bg-primary p-3 my-5 font-medium text-white hover:bg-opacity-90">Edit Client Details</button>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white"> Filter Information</h4>
          <div className="flex w-full">
              <div className="grid grid-row-5 rounded-sm bg-gray-2 dark:bg-meta-4 w-full">
                <div className="p-2.5 border-b border-stroke ">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Sediment Filter present
                  </h5>
                </div>
                <div className="p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Ultra 3 Change Date
                  </h5>
                </div>
                <div className="p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Reverse Osmosis Change date
                  </h5>
                </div>
                <div className=" p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Post Carbon Change date
                  </h5>
                </div>
              
                <div className=" p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Remineralizing Cartilage
                  </h5>
                </div>
              </div> 
              <div className={`grid grid-rows-5 dark:border-strokedark w-full`} >
                <div className="border-b border-stroke flex tems-center justify-center p-2.5">
                  <p className=" text-black dark:text-white sm:block">{filterInfo.sedimentFilter ? "Yes" : "No"}</p>
                </div>

                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{(filterInfo.u3_ChangeDate).toDateString()}</p>
                </div>

                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className="text-meta-3">{(filterInfo.ro_ChangeDate).toDateString()}</p>
                </div>

                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{(filterInfo.pc_ChangeDate).toDateString()}</p>
                </div>

                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{(filterInfo.rc_ChangeDate).toDateString()}</p>
                </div>
              </div>
            </div>
            <button className="flex w-full justify-center rounded bg-primary p-3 my-5 font-medium text-white hover:bg-opacity-90">Edit Filter Information</button>
        </div>
    </div>
    </DefaultLayout>
  )
}

export default Clients