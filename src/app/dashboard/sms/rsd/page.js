"use client"
import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import toast from 'react-hot-toast';
import Image from "next/image";

function RSD() {
   
    const [client, setClient] = useState([]);
    const [message,setMessage] = useState("");

    const sendSMS = async (e) => {
        e.preventDefault();
        if(!client){
            toast.error("Client contact cannot be empty");
        }else if(client.split("").length !== 10){
            toast.error("Client contact should be 10 digits total. Use the format provided.")
        }else if(Number.isNaN(Number(client))){
            toast.error("Client contact should contain digits only, check your input");
        }
        else if(!message){
            toast.error("Write down a message for the client selected");
        }
        else{
            toast.success("Text message sent successfully");
            // implement sending message
        }
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="sms" additonalRoute="dental"></Breadcrumb>
            <div className="rounded-md border border-stroke bg-white p-5   mb-7  shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
                <Image width={140} height={140} className="m-auto" src={"/images/rsd.jpg"} alt="Logo"></Image>
                <form onSubmit={(e)=>sendSMS(e)}>
                    <div className="px-6.5">
                        <label className="mb-2.5 text-black dark:text-white"> Patient Cell </label>
                        <input type="tel" placeholder="0712345678" onChange={(e)=>setClient(e.target.value)}
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`} 
                        ></input>
                    </div>
                    <div className="p-6.5">
                        <label className="mb-2.5 block text-black dark:text-white">Message</label>
                        <textarea className="border w-full h-24 rounded-md" onChange={(e)=> setMessage(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 my-7 font-medium text-gray hover:bg-opacity-90">Send Text Message</button>
                </form>
            </div>
        </DefaultLayout>
    )
}

export default RSD