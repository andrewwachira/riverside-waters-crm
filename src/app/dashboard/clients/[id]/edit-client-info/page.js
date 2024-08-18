"use client"
import React, { useEffect,useState } from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useForm } from 'react-hook-form'
import { getClientData,editClientData } from '@/actions/server';
import Error from '@/components/Modals/Error';
import Success from '@/components/Modals/Success';
import { useRouter } from 'next/navigation';

function EditClientInfo({params}) {
  const {register,formState:errors,handleSubmit,setValue} = useForm();
  const [loading,setLoading] = useState(false);
  const [fetchError,setFetchError] = useState(false);
  const [updateError,setUpdateError] = useState(false);
  const [error,setError] = useState("");
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [successMessage,setSuccessMessage] = useState("");
  const [triggerEffect,setTriggerEffect] = useState(false);
  const router = useRouter();
  
  useEffect(()=>{
    const getData = async()=>{
      setLoading(true);
      const res = await getClientData(params.id);
      if(res.status == 200){
        setValue("firstName",res.client.firstName);
        setValue("lastName",res.client.lastName);
        setValue("phoneNumber",res.client.phoneNumber);
        setValue("residence",res.client.residence);
        setValue("contactName",res.client.contactName);
        setValue("contactCell",res.client.contactCell);
      }else{
        setFetchError(res.error);
      }
      setLoading(false);
    }
    getData();

  },[params.id,setValue,triggerEffect]);
  
  const handleEditClient = async({firstName,lastName,phoneNumber,residence,contactName,contactCell}) => {
    const res = await editClientData({clientId:params.id,firstName,lastName,phoneNumber,residence,contactName,contactCell});
    if(res.status == 200) {
      setTriggerEffect(true);
      setSuccessMessage("Client Update operation was successfull");
      setUpdateSuccess(true);
    }else{
      setError(res.error);
      setUpdateError(true);
    }
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
        <Breadcrumb pageName="clients" additonalRoute="edit-client-info" />
        {updateError && <Error onRequestClose={onErrRequestClose} message={error}/>}
        {updateSuccess && <Success onRequestClose={onSuccRequestClose} message={successMessage}/>}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 bg-blue-900 rounded-t-md dark:border-strokedark flex justify-between">
                <h3 className="font-medium text-white dark:text-white">Edit Client Data Form</h3>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#fff" fill="none">
                    <path d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 20H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                </div>
            </div>
            <form action="#" id="client-registration-form" onSubmit={handleSubmit(handleEditClient)}>
              { fetchError ?
                <div className="w-fit border border-rose-600 rounded-md m-auto my-3 bg-rose-200 p-3 text-rose-800">Error fetching the Data. Details</div>
                :
              loading ? 
              <div className="flex h-full items-center justify-center bg-white dark:bg-black">
                <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                <span className="m-3">Loading...</span>
              </div>
              :
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">First name</label>
                            <input name='firstName' {...register("firstName",{required:"First Name is required"})} placeholder="Enter client's first name" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text ${errors?.firstName && "border-danger"}`}/>
                            {errors.firstName && <div className='text-rose-500'>{errors?.firstName?.message}</div>}
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Last name</label>
                            <input name="lastName" {...register("lastName",{required:"Last Name is required"})} placeholder="Enter client's last name" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text ${errors?.lastName && "border-danger"}`}/>
                            {errors.lastName && <div className='text-rose-500'>{errors?.lastName?.message}</div>}
                        </div>
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Phone Number<span className="text-meta-1">*</span></label>
                        <input name="phoneNumber" {...register("phoneNumber",{required:{value: /^\d{10,10}$/,message:"Enter phone Number as per the format"}})} placeholder="0720-123-123 " className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.phoneNumber && "border-danger"}`} type="number"/>
                        {errors.phoneNumber && <div className='text-rose-500'>{errors?.phoneNumber?.message}</div>}
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Residence</label>
                        <input name="residence" {...register("residence",{required:"Residence is required"})} placeholder="Enter client's residence"className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.residence && "border-danger"}`} type="text"/>
                        {errors.residence && <div className='text-rose-500'>{errors?.residence?.message}</div>}
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Contact Person Name</label>
                        <input name="contactName" {...register("contactName",{required:"Contact Person Name is required"})}  placeholder="Enter Client's contact person" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.contactName && "border-danger"}`} type="text"/>
                        {errors.contactName && <div className='text-rose-500'>{errors?.contactName?.message}</div>}
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Contact Person Phone Number</label>
                        <input name="contactCell" {...register("contactCell",{required:{value: /^\d{10,10}$/,message:"Enter phone Number as per the format"}})}  placeholder="0720-123-123" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.contactCell && "border-danger"}`} type="tel"/>
                        {errors.contactCell && <div className='text-rose-500'>{errors?.contactCell?.message}</div>}
                    </div>
                    <button type='submit' className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">Save Changes</button>
                </div>
              }
            </form>
        </div>
    </DefaultLayout>
  )
}

export default EditClientInfo