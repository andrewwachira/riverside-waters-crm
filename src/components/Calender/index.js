"use client"
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import {useState,useEffect} from "react";
import Link from "next/link";
import { getScheduleData } from "@/actions/server";
import { getDateDiff } from "@/lib/utils";

const Calendar = () => {
  const [month,setMonth] = useState(new Date().getMonth());
  const [year,setYear] = useState(new Date().getFullYear());
  const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDay();
  const currentDate = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const [schedulerData,setSchedulerData] = useState([]);
  const [scheduleDataErr,setScheduleDataErr] = useState(null);
  const [loading,setLoading] = useState(false);
  const [weeks,setWeeks] = useState(generateCalendar());
  console.log(schedulerData);
  useEffect(()=>{
      async function getData(){
        setLoading(true);
       const res =  await  getScheduleData();
        if(res.status === 200){
          let clients,filters;
          const {payload} = res;
          clients = payload.clients;
          filters = payload.filters;
          for (let client of clients) {
            for(let filter of filters){
              let filterEventArr = [
                  {date:filter.u3_ChangeDate,name:"Ultra 3 filters"},
                  {date:filter.ro_ChangeDate,name:"Reverse Osmosis"},
                  {date:filter.pc_ChangeDate,name:"Post Carbon"},
                  {date:filter.rc_ChangeDate,name:"Remineralizing Cartilage"}
              ];
              let filterEventArr2 = [filter.u3_ChangeDate,filter.ro_ChangeDate,filter.pc_ChangeDate,filter.rc_ChangeDate];
              filter.filterEvents = filterEventArr.sort((a,b)=> new Date(a.date)- new Date(b.date));
              filter.filterEventsArr = filterEventArr2.sort((a,b)=> new Date(a)- new Date(b));
              filter.soonestDate = filterEventArr[0].date;
              if(client._id == filter.clientId){
                client.filterInfo = filter;
              }
            } 
          }
          setSchedulerData(clients);
          setLoading(false);
        }else{
          setScheduleDataErr(res.error);
        }
      } 
      getData();
  },[currentDate])
  
  function isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  function getDaysInMonth(month){
    const daysInMonth = monthDays[month];
    return (month === 1 && isLeapYear(currentYear)) ? 29 : daysInMonth;
  };

  function generateCalendar(){
    const daysInCurrentMonth = getDaysInMonth(month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const weeks = [];
    let currentDay = 1;
    // Create each week of the calendar
    while (currentDay <= daysInCurrentMonth) {
        const week = [];
        // Fill initial empty cells for the first week
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            if (weeks.length === 0 && dayOfWeek < firstDayOfMonth) {
                week.push(null);
            } else if (currentDay > daysInCurrentMonth) {
                week.push(null);
            } else {
                week.push(currentDay);
                currentDay++;
            }
        }
        weeks.push(week);
    }
    return weeks;
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex mb-2">
      <button className="mr-4 flex items-center border-b" onClick={()=>setYear(prevState => --prevState)}> 
        <svg className="rotate-90 scale-110 hidden fill-current sm:block" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z" fill="" />
        </svg>
        {year -1}
      </button>
      <button className="ml-0 flex items-center border-b" onClick={()=>setYear(prevState => ++prevState)}> {year +1}
        <svg className=" -rotate-90 scale-110 hidden fill-current sm:block" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z" fill="" />
        </svg>
      </button>
      </div>
      <Breadcrumb pageName={`scheduler`} additonalRoute={`${year}`} />
      {scheduleDataErr && <div className="w-fit border border-rose-600 rounded-md m-auto my-3 bg-rose-200 p-3 text-rose-800">{scheduleDataErr}</div>}
      <div className="flex items-center justify-center">
        <button className="px-1 mx-4  bg-primary px-4 py-2 rounded-md text-center text-sm text-white" onClick={()=>setMonth(prevState=> --prevState)} >Previous</button>
        <h1 className="text-3xl py-2 w-full text-black dark:text-slate:400 font-bold text-center">{monthsArray[month]}</h1>
        <button className="px-1 mx-4 bg-primary px-4 py-2 rounded-md text-center text-sm text-white" onClick={()=>setMonth(prevState=> ++prevState)}>Next</button>
      </div>
       <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
       <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Sunday </span>
                <span className="block lg:hidden"> Sun </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Monday </span>
                <span className="block lg:hidden"> Mon </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Tuesday </span>
                <span className="block lg:hidden"> Tue </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Wednesday </span>
                <span className="block lg:hidden"> Wed </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Thursday </span>
                <span className="block lg:hidden"> Thur </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Friday </span>
                <span className="block lg:hidden"> Fri </span>
              </th>
              <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Saturday </span>
                <span className="block lg:hidden"> Sat </span>
              </th>
            </tr>
          </thead>
          { loading ?  
          <div className="flex h-full items-center justify-center bg-white dark:bg-black">
            <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <span className="m-3">Loading...</span>
           </div>
           :
          <tbody>
              {
              weeks.length > 1 ? weeks.map((week, index) => (
                <tr className="grid grid-cols-7" key={index}>
                    {week.map((day, i) => {
                      const events = schedulerData.filter(client => client.filterInfo.filterEvents.some(event =>   new Date(event.date).getDate() === day && new Date(event.date).getMonth() === month && new Date(event.date).getFullYear() === year));

                      return(
                        <td className={ `ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31 ${day === currentDate && month === currentMonth && year === currentYear && 'bg-orange-500'}`} key={i}>
                         <span className="font-medium text-black dark:text-white">{day || ''}</span>
                         { events.length > 0 && events.map((event,idx) => (
                         <Link href={`/dashboard/clients/${event._id}`}  key={idx} className="group h-16 w-full flex-grow cursor-pointer py-1 md:h-30">
                            <span className="group-hover:text-primary md:hidden">
                              More
                            </span>                           
                             <span className="event invisible absolute left-0 z-9 mb-1 flex w-[100%] flex-col rounded-sm border-l-[3px] border-primary text-sm bg-gray px-3 py-1 text-left opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-meta-4 md:visible md:w-fit md:opacity-100">
                              <span className="event-name text-sm font-semibold text-black dark:text-white">
                                {event.firstName + " " + event.lastName}
                              </span>
                              <span className="time text-sm font-medium text-black dark:text-white">
                                {event.filterInfo.filterEvents.find(evt => new Date(evt.date).getDate() === day && new Date(evt.date).getMonth() === month && new Date(evt.date).getFullYear() === year)?.name}
                              </span>
                            </span>
                          </Link>
                          ))}
                        </td> )
                  })}
                </tr>
                )
              )
            : <tr>
                <span className="flex h-full items-center justify-center bg-white dark:bg-black">
                  <span className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></span>
                  <span className="m-3">Loading...</span>
                </span>
              </tr>
            }
          </tbody>
          }
        </table>
      </div> 

      <div className="rounded-sm border my-16 border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className='flex justify-between items-center mb-4'>
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Upcoming filter change events
          </h4>
          <div className='flex'>
            <span className='text-rose-600 mx-1'>{`< 7 days`}</span>  |
            <span className='text-orange-500 mx-1'>{`< 21 days`}</span> |
            <span className='text-meta-3 mx-1'>{`> 3 weeks`}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Client
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Date
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Filters
              </h5>
            </div>
          </div>

          {schedulerData.length > 0 ? schedulerData.map((event, key) => (
            <div className={`grid grid-cols-3 sm:grid-cols-3 ${key >= schedulerData.length - 1 && "border-b border-stroke dark:border-strokedark"}`} key={key}>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {event?.firstName + " " + event?.lastName}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{(event?.filterInfo?.filterEvents[0]?.date)}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className={`${getDateDiff(event?.filterInfo?.filterEvents[0].date) < 7 ? "text-rose-600" : getDateDiff(event?.filterInfo?.filterEvents[0].date) < 21 ? "text-orange-500" : "text-meta-3"}`}>{event?.filterInfo?.filterEvents[0].name}</p>
              </div>
            </div>
          )):
          loading ? 
          <div className="flex h-full items-center justify-center bg-white dark:bg-black">
            <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <span className="m-3">Loading...</span>
          </div>
          :
          <div className="w-full border border-rose-600 rounded-md m-auto my-3 bg-rose-200 p-3 text-rose-800">No data at the moment</div>}
        </div>
      </div>  
    </div>
  );
};

export default Calendar;
