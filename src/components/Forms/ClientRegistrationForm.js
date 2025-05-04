"use client";
import {useState,useEffect} from 'react';
import DatePicker from '../FormElements/DatePicker/DatePicker';
import { useForm } from 'react-hook-form';
import { createClientForm} from '@/actions/server';
import useColorMode from '@/hooks/useColorMode';
import toast from 'react-hot-toast';

function ClientRegistrationForm() {

    const [colorMode, setColorMode] = useColorMode();
    const {register,handleSubmit,formState:{errors},reset} = useForm();
    const [clientFormOpen,setClientFormOpen] = useState(false); 
    const [doiErr,setDoiErr] = useState(null);
    const [doi,setDoi] = useState(null);


    useEffect( ()=>{
         
    },[colorMode])

    //DOI means Date of Installation. A date that could be in the future,present or past.
    const getDOIDate= (date) => {
        setDoi(date);
        setDoiErr(false);
    }
     const handleClientRegistration = async({firstName,lastName,phoneNumber,county,residence,contactName,contactCell}) => {
            if(!doi){
                setDoiErr(true);
                return
            }
            try {
                const saveClient = await createClientForm(firstName,lastName,phoneNumber,county,residence,contactName,contactCell,doi);
                if (saveClient.status === 201) {
                    setTrigger(true);
                    reset();
                    setClientFormOpen(false);
                    toast.success("Client created successfully");
                }else{
                    toast.error(saveClient.error)
                }
            } catch (error) {
                toast.error(error.message);
            }
            
        }
    return (
        <>
        <div className="flex m-5 flex-col gap-9 z-40">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div onClick={()=>setClientFormOpen(!clientFormOpen)} className="border-b border-stroke px-6.5 py-4 bg-blue-900 rounded-md dark:border-strokedark flex justify-between">
                    <h3 className="font-medium text-white dark:text-white">FORM 1 - Client Registration Form</h3>
                    <div onClick={()=>setClientFormOpen(!clientFormOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className={ !clientFormOpen ? `rotate-0 transition ease-in-out` : "rotate-45 transition ease-in-out"} color={"#fff"} fill={"none"}>
                            <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <form action="#" id="client-registration-form" onSubmit={handleSubmit(handleClientRegistration)} className={`overflow-hidden transition-all duration-500 ease-in-out ${ clientFormOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0" }`}>
                    <div className="p-6.5">
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">First name<span className="text-meta-1">*</span></label>
                                <input name='firstName' {...register("firstName",{required:"First Name is required"})} placeholder="Enter client's first name" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text ${errors?.firstName && "border-danger"}`}/>
                                {errors.firstName && <div className='text-rose-500'>{errors?.firstName?.message}</div>}
                            </div>
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Last name<span className="text-meta-1">*</span></label>
                                <input name="lastName" {...register("lastName",{required:"Last Name is required"})} placeholder="Enter client's last name" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text ${errors?.lastName && "border-danger"}`}/>
                                {errors.lastName && <div className='text-rose-500'>{errors?.lastName?.message}</div>}
                            </div>
                        </div>
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Phone Number<span className="text-meta-1">*</span></label>
                            <input name="phoneNumber" {...register("phoneNumber",{required:{value: /^\d{10,10}$/,message:"Enter phone Number as per the format"}})} placeholder="0720-123-123 " className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.phoneNumber && "border-danger"}`} type="number"/>
                            {errors.phoneNumber && <div className='text-rose-500'>{errors?.phoneNumber?.message}</div>}
                        </div>
                        <div className='mb-4.5'>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">County<span className="text-meta-1">*</span></label>
                            <input name="county" {...register("county",{required:"County is required"})} placeholder="e.g Kisumu" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.county && "border-danger"}`} type="text"/>
                            {errors.county && <div className='text-rose-500'>{errors?.county?.message}</div>}

                        </div>
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Residence<span className="text-meta-1">*</span></label>
                            <input name="residence" {...register("residence",{required:"Residence is required"})} placeholder="Enter client's residence"className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.residence && "border-danger"}`} type="text"/>
                            {errors.residence && <div className='text-rose-500'>{errors?.residence?.message}</div>}
                        </div>
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Contact Person Name</label>
                            <input name="contactName" {...register("contactName",)}  placeholder="Enter Client's contact person" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.contactName && "border-danger"}`} type="text"/>
                            {errors.contactName && <div className='text-rose-500'>{errors?.contactName?.message}</div>}
                        </div>
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Contact Person Phone Number</label>
                            <input name="contactCell" {...register("contactCell")}  placeholder="0720-123-123" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.contactCell && "border-danger"}`} type="tel"/>
                            {errors.contactCell && <div className='text-rose-500'>{errors?.contactCell?.message}</div>}
                        </div>
                        <div className="mb-4.5">
                            <div className="my-4.5"><DatePicker inputName="doi"  getDatefn={getDOIDate} Err={doiErr}  labelName={<><span>Date of Installation</span><span className="text-meta-1">*</span></>}/></div>   
                        </div>
                        <button type='submit' className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">Save Client</button>
                    </div>
                </form>
            </div>
        </div>
        </>
  )
}

export default ClientRegistrationForm