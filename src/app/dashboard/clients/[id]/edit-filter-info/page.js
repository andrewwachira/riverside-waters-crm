"use client"
import React, { useEffect,useState } from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { getFilterData,editFilterData } from '@/actions/server';
import Error from '@/components/Modals/Error';
import Success from '@/components/Modals/Success';
import { useRouter } from 'next/navigation';
import DatePicker from '@/components/FormElements/DatePicker/DatePicker';

function EditFilterInfo({params}) {
  const [loading,setLoading] = useState(false);
  const [fetchError,setFetchError] = useState(false);
  const [updateError,setUpdateError] = useState(false);
  const [error,setError] = useState("");
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [successMessage,setSuccessMessage] = useState("");
  const [triggerEffect,setTriggerEffect] = useState(false);
  const router = useRouter();
  const [filterId,setFilterId] = useState(null);
  const [u3,setU3] = useState(false);
  const [ro,setRo] = useState(false);
  const [pc,setPc] = useState(false);
  const [rc,setRc] = useState(false);
  const [u3Val,setU3Val] = useState(false);
  const [roVal,setRoVal] = useState(false);
  const [pcVal,setPcVal] = useState(false);
  const [rcVal,setRcVal] = useState(false);
  const [res,setRes] = useState(null);
  const [sedimentFilter,setSedimentFilter] = useState(false);
  const [filterDates,setFilterDates] = useState([]);
  const [submitLoading,setSubmitLoading] = useState(false);

  useEffect(()=>{
    const getData = async()=>{
      setLoading(true);
      const res = await fetch(`/api/clients/${params.id}/filterInfo`);
      const data = await res.json();
      if(res.status === 200) setRes(res); setLoading(false);
      if(res.status === 200 && data.filter !== null){
        setU3Val(data.filter.u3_ChangeDate);
        setRoVal(data.filter.ro_ChangeDate);
        setPcVal(data.filter.pc_ChangeDate);
        setRcVal(data.filter.rc_ChangeDate);
        const prevU3 = {filterName:"u3",date:data.filter.u3_ChangeDate};
        const prevRo = {filterName:"ro",date:data.filter.ro_ChangeDate};
        const prevPc = {filterName:"pc",date:data.filter.pc_ChangeDate};
        const prevRc = {filterName:"rc",date:data.filter.rc_ChangeDate};
        setFilterId(data.filter._id);
        setFilterDates([prevU3,prevRo,prevPc,prevRc]);
      }else{
        setFetchError(res.error);
      }
      setLoading(false);
    }
    getData();

  },[params.id,triggerEffect]);

   const getDate= (date,inputName) => {
        const item =filterDates.find(item => item.filterName === inputName).date=date;
  }
  
  const handleEditFilter = async(e) => {
    e.preventDefault();
    if(filterDates.length !== 4){
      const unfilled = []
      const obj = {
          "u3" : filterDates.find(date => date.filterName === "u3"),
          "ro" : filterDates.find(date => date.filterName === "ro"),
          "pc" : filterDates.find(date => date.filterName === "pc"),
          "rc" : filterDates.find(date => date.filterName === "rc"),
      }
      for(const property in obj){
          if(obj[property] === undefined){
              unfilled.push(property);
          }else{
              continue
          }
      }
      for (let item of unfilled){
          if(item == "u3") setU3(true);
          if(item == "ro") setRo(true);
          if(item == "pc") setPc(true);
          if(item == "rc") setRc(true);
      }

    }else{
        const filterData =  {
          clientId : params.id,
          filterId : filterId,
          u3_ChangeDate : filterDates.find(date=> date.filterName === "u3").date,
          ro_ChangeDate : filterDates.find(date=> date.filterName === "ro").date,
          pc_ChangeDate : filterDates.find(date=> date.filterName === "pc").date,
          rc_ChangeDate : filterDates.find(date=> date.filterName === "rc").date,
        }
        setSubmitLoading(true);
        const res = await editFilterData(filterData);
        if(res.status == 200) {
          setSubmitLoading(false);
          setTriggerEffect(true);
          setSuccessMessage("Filter Update operation was successfull");
          setUpdateSuccess(true);
        }else{
          setError(res.error);
          setUpdateError(true);
          setSubmitLoading(false);
        }
    }
}
  const clearWarning = (filterName) => {
    if(filterName == "u3") setU3(false);
    if(filterName == "ro") setRo(false);
    if(filterName == "pc") setPc(false);
    if(filterName == "rc") setRc(false);
}
  const onErrRequestClose = () => {
    setUpdateError(false);
    setError("");
  }
  const onSuccRequestClose = () => {
    setUpdateSuccess(false);
    setSuccessMessage("");
    setTimeout(()=>router.push("/dashboard/clients"),1000);
  }

  return (
    <DefaultLayout>
        <Breadcrumb pageName="clients" additonalRoute="edit-filter-info" />
        {updateError && <Error onRequestClose={onErrRequestClose} message={error}/>}
        {updateSuccess && <Success onRequestClose={onSuccRequestClose} message={successMessage}/>}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 bg-blue-900 rounded-t-md dark:border-strokedark flex justify-between">
                <h3 className="font-medium text-white dark:text-white">Edit Filter Data Form</h3>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#fff" fill="none">
                    <path d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 20H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                </div>
            </div>
            <form onSubmit={(e) => handleEditFilter(e)}  id="filter-change-form" >
            { fetchError ?
                <div className="w-fit border border-rose-600 rounded-md m-auto my-3 bg-rose-200 p-3 text-rose-800">Error fetching the Data. Details:{fetchError}</div>
                :
              loading  || !res?.status ?
              <div className="flex h-full items-center justify-center bg-white dark:bg-black">
                <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                <span className="m-3">Loading...</span>
              </div>
              :
              <div>
                    
                <div className="p-6.5">
                    <div className="my-4.5"><DatePicker inputName="u3" getDatefn={getDate} Err={u3} clearWarning={clearWarning} prevData={u3Val} labelName="ultra 3 filter Change Date"/></div>
                    <div className="my-4.5"><DatePicker inputName="ro" getDatefn={getDate} Err={ro} clearWarning={clearWarning} prevData={roVal}labelName="Reverse Osmosis Change Date"/></div>
                    <div className="my-4.5"><DatePicker inputName="pc" getDatefn={getDate} Err={pc} clearWarning={clearWarning} prevData={pcVal}labelName="Post Carbon filter Change Date"/></div>
                    <div className="my-4.5"><DatePicker inputName="rc" getDatefn={getDate} Err={rc} clearWarning={clearWarning} prevData={rcVal}labelName="Remineralyzing Cartilage Change Date"/></div> 
                    <button type="submit" className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 ${submitLoading && "pointer-events-none"}`}>{submitLoading ? "Loading...." : "Save Filter Info"}</button>
                </div>
              </div>
              }
            </form>
        </div>
        <div className='h-[50vh]'></div>
    </DefaultLayout>
  )
}

export default EditFilterInfo