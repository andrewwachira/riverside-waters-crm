"use client"
import React, { useState } from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useSearchParams,useParams } from 'next/navigation'
import Warning2 from '@/components/Modals/Warning2'
import { changeClientStatus } from '@/actions/server'
import toast from 'react-hot-toast'
import Link from 'next/link';

function Page() {
    const searchParams = useSearchParams();
    const {id} = useParams();
    const setStatus = searchParams.get("set");
    const client = searchParams.get("client");
    const [message,setMessage] = useState("");
    const [modalOpen,setModalOpen] = useState(true);

    const onRequestClose = ()=>{
       setModalOpen(false);
       toast.error(`You have aborted account status change for ${client}`);
    }

    async function action(res) {
        if(res === 0){
            const {status,message} = await changeClientStatus(id,setStatus);
            if(status === 200) {
                setModalOpen(false);
                toast.success(`Status changed successfully to ${setStatus === true ? "Active" : "Inactive"}`);
                setMessage(message); 
            }
            if(status === 500) {
                setModalOpen(false);
                toast.error("Status Change not successfull");
                setMessage(message);
            }
        }else{
            onRequestClose();
        }
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="clients" additonalRoute=".../ Change account Status"/>
            <div>
                {   modalOpen ? 
                    <Warning2 onRequestClose={onRequestClose} operation="Change Status" action={action} message={`you are about to change the account status for ${client} to ${setStatus === true ? "Active" : "Inactive"}`}/>
                    :
                    message ? 
                    <div className="h-fit py-10  bg-white dark:bg-black">
                        <p className='text-center'>{message}</p>
                        <Link href={`/dashboard/clients/${id}`} className="w-fit rounded bg-primary p-3 m-5 font-medium text-white hover:bg-opacity-90">
                          
                            <span>Go back</span>
                        </Link>
                    </div>
                    :
                    <div className=" h-fit py-10 bg-white dark:bg-black">
                        <h1 className='text-center text-2xl underline'>Status Change</h1>
                        <div className='flex items-center justify-center'>
                            <button onClick={()=> setModalOpen(true)} className="flex justify-center w-fit rounded bg-primary p-3 my-5 font-medium text-white hover:bg-opacity-90">Change {client}&apos; account status to {setStatus === true ? "Active" : "Inactive"} </button>
                        </div>
                    </div>
                    
                }
            </div>
        </DefaultLayout>
  )
}

export default Page