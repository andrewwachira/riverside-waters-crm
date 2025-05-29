"use client"
import dynamic from "next/dynamic";
import {useState,useEffect} from "react";
// import ChartOne from "../Charts/ChartOne";
// import ChartTwo from "../Charts/ChartTwo";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import useColorMode from "@/hooks/useColorMode";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import avatar from "../../../public/images/avatar.png";
import axios from "axios";
// const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
//   ssr: false,
// });

const   DashboardUI = () => {
  const [colorMode, setColorMode] = useColorMode();
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const [dashData,setDashData] = useState(null);
  useEffect(()=>{
    async function getDashData (){
      try {
        setLoading(true);
        const {data} = await axios.get("/api/dashboard");
        setLoading(false);
        setDashData(data.payload);
      } catch (error) {
        setError(error.message);
        toast.error(error.message)
      }
    }
    getDashData();
  },[]);

  return (
    <>
      {error && <div className="p-3 bg-rose-300 rounded-md mb-2 border border-rose-600 text-rose-600">{error}</div>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Active filters" total={loading ? <div className="cssLoader"></div> : dashData?.numUpcomingFilters }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
        </CardDataStats>
        <CardDataStats title="System Admin(s)" total={loading ? <div className="cssLoader"></div> : dashData?.numAdmins } >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        </CardDataStats>
    
        <CardDataStats title="Total Clients" total={loading ? <div className="cssLoader"></div> : dashData?.numClients }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
        </CardDataStats>
        <CardDataStats title="Filters Due" total={loading ? <div className="cssLoader"></div> : dashData?.numFiltersDue }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne /> */}
        {/* <ChartTwo /> */}
        {/* <ChartThree /> */}
        {/* <MapOne /> */}
        <div className="col-span-12 xl:col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Active Filters {loading && <div className="cssLoader"></div> }
            </h4>
          { dashData?.upcomingFilters.length < 1 ?
                <p className="mb-3">There are no Active filters</p>
              :
            <div className="flex flex-col">
              <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 md:grid-cols-4">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Client
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Residence
                  </h5>
                </div>
                <div className=" hidden p-2.5 text-center md:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Filters
                  </h5>
                </div>
                <div className=" hidden p-2.5 text-center md:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                   Date
                  </h5>
                </div>
              </div>

              {
              dashData?.upcomingFilters.map((filter, key) => (
                <div
                  className={`grid grid-cols-2 md:grid-cols-4 ${
                    key === dashData?.upcomingFilters?.length - 1
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  }`}
                  key={key}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <Link href={`/dashboard/clients/${filter?.clientId._id}`} className="text-black dark:text-white md:block">
                      {filter?.clientId.firstName + " " + filter?.clientId.lastName}
                    </Link>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{filter?.clientId.residence}</p>
                  </div>

                  <div className="hidden flex flex-col items-center justify-center p-2.5 xl:p-5 md:block">
                    {filter?.futureDates?.length > 0 && filter?.futureDates.map( date =>(
                     <div key={date.key} >
                        <p className="my-1 mx-auto ">{date.key}</p>
                     </div>
                    ))}
                  </div>

                  <div className="hidden flex flex-col items-center justify-center p-2.5 xl:p-5 md:block">
                    {filter?.futureDates?.length > 0 && filter?.futureDates.map( date =>(
                     <div key={date.key} >
                        <p className="my-1 mx-auto">{new Date(date.value).toDateString()}</p>
                     </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
          </div>
        </div>

        <div className="col-span-12 xl:col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Filter changes Due {loading && <div className="cssLoader"></div> }
            </h4>
          { dashData?.filtersDue.length < 1 ?
              <p className="mb-3">There are no filter change events due</p>
              :
            <div className="flex flex-col">
              <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 md:grid-cols-4">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Client
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Residence
                  </h5>
                </div>
                <div className="hidden p-2.5 text-center md:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Filters
                  </h5>
                </div>
                <div className="hidden p-2.5 text-center md:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Dates
                  </h5>
                </div>
              </div>

              {
              dashData?.filtersDue.map((filter, key) => (
                <div
                  className={`grid grid-cols-2 md:grid-cols-4 ${
                    key === dashData?.filtersDue?.length - 1
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  }`}
                  key={key}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <Link href={`/dashboard/clients/${filter?.clientId._id}`} className="text-black dark:text-white">
                      {filter?.clientId.firstName + " " + filter?.clientId.lastName}
                    </Link>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{filter?.clientId.residence}</p>
                  </div>

                  <div className="hidden md:block flex flex-col items-center justify-center p-2.5 xl:p-5">
                    {filter?.pastDates?.length > 0 && filter?.pastDates.map( date =>(
                     <div key={date.key} >
                        <p className="my-1">{date.key}</p>
                     </div>
                    ))}
                  </div>

                  <div className="hidden md:block flex flex-col items-center justify-center p-2.5 xl:p-5">
                    {filter?.pastDates?.length > 0 && filter?.pastDates.map( date =>(
                     <div key={date.key}>
                      <p className="my-1">{new Date(date.value).toDateString()}</p>
                     </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
          </div>
        </div>

        <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
          <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
            Admins {loading && <div className="cssLoader"></div> }
          </h4>

          <div>
            {dashData?.admins?.map((admin, key) => (
              <Link
                href={`/dashboard/settings/admin-profile/${admin._id}`}
                className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
                key={key}
              >
                <div className="relative h-14 w-14 rounded-full">
                  <Image
                    width={120}
                    height={120}
                    src={admin.image ? admin.image : avatar.src}
                    alt="User"
                    style={{ width: "auto",clipPath:"circle()", height: "auto"}}
                  />
                </div>

                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {admin.name}
                    </h5>
                    <p>
                      <span className="text-sm text-black dark:text-white">
                        {admin.bio ? admin.bio : ""}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardUI;
