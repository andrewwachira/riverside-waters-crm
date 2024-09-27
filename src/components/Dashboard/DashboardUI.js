"use client"
import dynamic from "next/dynamic";
import {useState} from "react";
// import ChartOne from "../Charts/ChartOne";
// import ChartTwo from "../Charts/ChartTwo";
// import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import useColorMode from "@/hooks/useColorMode";
import useSWR from "swr";
// // const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
// //   ssr: false,
// // });

// const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
//   ssr: false,
// });

const DashboardUI = () => {

  const [dashData,setDashData] = useState(null);
  const dashFetcher = async(key) => {
    let res = await fetch(key);
    res = await res.json();
    if(res.eror){
      setError(res?.error?.message);
    }else{
      setDashData(res.payload);
    }
  }
  const {loading,data,error} = useSWR("/api/dashboard",dashFetcher)
  console.log(dashData);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Upcoming Filter Changes" total={loading ? <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> : dashData?.numUpcomingFilters }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
        </CardDataStats>
        <CardDataStats title="System Admin(s)" total={loading ? <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> : dashData?.admins } >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        </CardDataStats>
    
        <CardDataStats title="Total Clients" total={loading ? <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> : dashData?.clients }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
        </CardDataStats>
        <CardDataStats title="Filters Due" total={loading ? <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> : dashData?.numFiltersDue }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne /> */}
        {/* <ChartTwo /> */}
        {/* <ChartThree /> */}
        {/* <MapOne /> */}
        <div className="col-span-12 xl:col-span-8">
          {/* <TableOne /> */}
        </div>
        {/* <ChatCard /> */}
      </div>
    </>
  );
};

export default DashboardUI;
