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
  const filterInfo = await Filter.find({clientId:params.id});
  const testInfo  = await Test.find({clientId:params.id});

  return (
    <DefaultLayout>
      <Breadcrumb pageName="clients" additonalRoute={client.firstName}/>
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

              <div className=" p-2.5 border-b border-stroke">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Date of Installation
                </h5>
              </div>
            </div> 
            <div className={`grid grid-rows-5 dark:border-strokedark w-full`} >
              <div className="border-b border-stroke flex tems-center justify-center p-2.5">
                <p className=" text-black dark:text-white sm:block">{client?.firstName + " " + client?.lastName}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client?.phoneNumber}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client?.residence}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client?.contactPerson?.name}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{client?.contactPerson?.phoneNumber}</p>
              </div>

              <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                <p className="text-black dark:text-white">{(client?.dateOfInstallation)?.toDateString()}</p>
              </div>
            </div>
          </div>
          <Link href={`/dashboard/clients/${client?._id}/edit-client-info`} className="flex w-full justify-center rounded bg-primary p-3 my-5 font-medium text-white hover:bg-opacity-90">Edit Client Details</Link>

        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 mb-7 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <div className='flex justify-between items-center mb-4'>
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Latest Filter Information</h4>
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
                  <p className={`text-black sm:block`}>{filterInfo[filterInfo.length-1]?.sedimentFilter ? "Yes" : "No"}</p>
                </div>
                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className={`text-black ${getDateDiff(filterInfo[filterInfo.length-1]?.u3_ChangeDate) < 7 ? "text-rose-600" : getDateDiff(filterInfo[filterInfo.length-1]?.u3_ChangeDate) < 21 ? "text-orange-500" : "text-meta-3"}`}>{(filterInfo[filterInfo.length-1]?.u3_ChangeDate)?.toDateString()}</p>
                </div>
                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className={`text-black ${getDateDiff(filterInfo[filterInfo.length-1]?.u3_ChangeDate) < 7 ? "text-rose-600" : getDateDiff(filterInfo[filterInfo.length-1]?.u3_ChangeDate) < 21 ? "text-orange-500" : "text-meta-3"}`}>{(filterInfo[filterInfo.length-1]?.ro_ChangeDate)?.toDateString()}</p>
                </div>
                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className={`text-black ${getDateDiff(filterInfo[filterInfo.length-1]?.u3_ChangeDate) < 7 ? "text-rose-600" : getDateDiff(filterInfo[filterInfo.length-1]?.u3_ChangeDate) < 21 ? "text-orange-500" : "text-meta-3"}`}>{(filterInfo[filterInfo.length-1]?.pc_ChangeDate)?.toDateString()}</p>
                </div>
                <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                  <p className={`text-black ${getDateDiff(filterInfo[filterInfo.length-1]?.u3_ChangeDate) < 7 ? "text-rose-600" : getDateDiff(filterInfo[filterInfo.length-1]?.u3_ChangeDate) < 21 ? "text-orange-500" : "text-meta-3"}`}>{(filterInfo[filterInfo.length-1]?.rc_ChangeDate)?.toDateString()}</p>
                </div>
              </div>
            </div>
            <Link href={`/dashboard/clients/${client._id}/edit-filter-info`}  className="flex w-full justify-center rounded bg-primary p-3 my-5 font-medium text-white hover:bg-opacity-90">Edit Filter Information</Link>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 mb-7 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Latest Test Information</h4>
              { 
                testInfo.length >0 ?
                <>
                  <h4 className="mb-2  font-semibold text-black dark:text-white">Floride Test Information</h4>
                  <div className='flex w-full mb-6'>
                      <div className="grid grid-row-4 rounded-sm bg-gray-2 dark:bg-meta-4 w-full">
                          <div className="p-2.5 border-b border-stroke ">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
                          </div>
                          <div className="p-2.5 border-b border-stroke">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Raw</h5>
                          </div>
                          <div className="p-2.5 border-b border-stroke">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Treated</h5>
                          </div>
                          <div className=" p-2.5 border-b border-stroke">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">File</h5>
                          </div>
                      </div>

                      <div className="grid grid-row-4 rounded-sm bg-white dark:bg-meta-4 w-full">
                          <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                            <p className={`text-black`}>{testInfo[testInfo.length-1].testResults.florideTest.date.toDateString()}</p>
                          </div>
                          <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                            <p className={`text-black`}>{testInfo[testInfo.length-1].testResults.florideTest.raw}</p>
                          </div>
                          <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                            <p className={`text-black`}>{testInfo[testInfo.length-1].testResults.florideTest.treated}</p>
                          </div>
                          <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                            <Link href={testInfo[testInfo.length-1].testResults.florideTest.file} target="_blank" className={`text-blue-600 underline flex justify-bottom`}>
                              <span>open</span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </Link>
                          </div>
                      </div>
                  </div>

                  {testInfo[testInfo.length-1].testResults?.otherTest &&
                    <>
                      <h4 className="mb-2  font-semibold text-black dark:text-white">Other Test Information</h4>
                      <table className='flex mb-6 w-full'>
                        <thead className="grid grid-rows-4 rounded-sm bg-gray-2 dark:bg-meta-4 w-full">
                          <th className="p-2.5 border-b border-stroke ">
                            <h5 className="text-sm text-start font-medium uppercase xsm:text-base">Date</h5>
                          </th>
                          <th className="p-2.5 border-b border-stroke">
                            <h5 className="text-sm text-start font-medium uppercase xsm:text-base">Test Name</h5>
                          </th>
                          <th className="p-2.5 border-b border-stroke">
                            <h5 className="text-sm text-start font-medium uppercase xsm:text-base">Test Results</h5>
                          </th>
                          <th className=" p-2.5 border-b border-stroke">
                            <h5 className="text-sm text-start font-medium uppercase xsm:text-base">File</h5>
                          </th>
                        </thead>
                        {testInfo[testInfo.length-1].testResults.otherTest.map( test => (
                        <tbody key={test._id}   className="grid grid-rows-4 rounded-sm bg-white dark:bg-meta-4 w-full">
                          <td className=" p-2.5 text-center border-b border-stroke">
                            {test.testDate.toDateString()}
                          </td>
                          <td className=" p-2.5 text-center border-b border-stroke">
                            {test.testName}
                          </td>
                          <td className=" p-2.5 text-center border-b border-stroke">
                            {test.testResult}
                          </td>
                          <td  className=" border-b border-stroke flex items-center justify-center p-2.5">
                            <Link href={test.testFileUrl} target='_blank' className="text-blue-600 underline flex justify-bottom">
                                <span>open</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5 ml-1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </Link>
                          </td>
                        </tbody>
                        ))}
                      </table>
                    </>
                  }

                </>
                :
                <div className="w-full border border-rose-600 rounded-md m-auto mx-4 mb-4 text-center my-3 bg-rose-200 p-3 text-rose-800">No Test Details Yet</div>
              }
        </div >

        <div className="rounded-sm border border-stroke bg-white px-5 mb-7 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Change History</h4>
              <div className='flex w-full mb-6'>
                <div className="grid grid-row-3 rounded-sm bg-gray-2 dark:bg-meta-4 w-full">
                    <div className="p-2.5 border-b border-stroke ">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
                    </div>
                    <div className="p-2.5 border-b border-stroke">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">Change Round</h5>
                    </div>
                    <div className="p-2.5 border-b border-stroke">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">Comments</h5>
                    </div>
                </div>
                {
                  filterInfo?.map(filter => (
                    <div key={filter._id} className="grid grid-row-3 rounded-sm bg-white dark:bg-meta-4 w-full">
                        <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                          <p className={`text-black`}>{filter.updatedAt?.toDateString()}</p>
                        </div>
                        <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                          <p className={`text-black`}>{filter.changeCycle}</p>
                        </div>
                        <div className=" border-b border-stroke flex items-center justify-center p-2.5">
                          <p className={`text-black`}>{filter.comments ? filter.comments : "_"}</p>
                        </div>
                    </div>
                  ) )
                }
            </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Account Status and Deletion</h4>
          <div className="grid grid-row-1 bg-gray-2 dark:bg-meta-4 w-full">
            <div className="p-2.5 ">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Account Status</h5>
            </div>
          </div>
          <div className="grid grid-row-1 rounded-sm border border-stroke mb-5 bg-white dark:bg-meta-4 w-full">
            <div className=" flex justify-between items-center p-2.5 border-b border-stroke ">
                <h5 className="text-sm font-medium uppercase xsm:text-base">{client.isActive ? <span className='text-green-500'>Active</span> : <span className='text-orange-600'>Inactive</span>}</h5>
                <Link href={`/dashboard/clients/${client._id}/account-management/status?set=${!client.isActive}`} className="flex justify-center rounded bg-primary p-3 my-5 font-medium text-white hover:bg-opacity-90">Change status to {client.isActive ? "Inactive" : "Active"}</Link>
            </div>
          </div>
          <div className="grid grid-row-1 bg-danger border-stroke dark:bg-meta-4 w-full">
            <div className="p-2.5 ">
                <h5 className="text-sm font-medium   uppercase text-white xsm:text-base">Account Deletion </h5>
            </div>
          </div>
          <div className="grid grid-row-1 border border-stroke mb-7 rounded-sm dark:bg-meta-4 w-full">
            <div className=" flex justify-center items-center p-2.5 border-b border-stroke ">
                <Link href={`/dashboard/clients/${client._id}/account-management/delete`} className="flex justify-center rounded bg-danger p-3 my-5 font-medium text-white hover:bg-opacity-90">Permanently delete {client.firstName} {client.lastName}&apos;s account</Link>
            </div>
          </div>
        </div>
    </div>
    <div className='h-[50vh]'></div>
    </DefaultLayout>
  )
}

export default Clients