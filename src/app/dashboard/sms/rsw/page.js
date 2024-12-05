"use client";
import { useState,useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getClients } from '@/actions/server';
import toast from 'react-hot-toast';
import Image from "next/image";
import axios from "axios";

function RSW() {
    const [clients,setClients]  = useState([]);
    const [clientsLoading,setClientsLoading]  = useState(false);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedClientsCell, setSelectedClientsCell] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [dropOpen,setDropOpen] = useState(false);
    const [message,setMessage] = useState("");

    useEffect(()=>{
        const fetchClients = async () => {
            setClientsLoading(true);
            const clients = await getClients();
            setClients(clients);
            setClientsLoading(false);
        }
     fetchClients();
    },[])

    const handleSelectAllChange = () => {
        setSelectAll((prev) => !prev);
        if (!selectAll) {
            const allClientsCell = clients.map(client => "254".concat(Number(client.phoneNumber)));
            setSelectedClients(clients);
            setSelectedClientsCell(allClientsCell);
        } else {
            setSelectedClients([]);
            setSelectedClientsCell([]);
        }
    };
    
    const handleCheckboxChange = (client) => {
        setSelectedClients((prev) => {
            const updatedClients = prev.some(c => c._id === client._id)
                ? prev.filter((item) => item._id !== client._id)
                : [...prev, client];
            
            // Update selectedClientsCell directly
            setSelectedClientsCell(updatedClients.map(c => "254".concat(Number(c.phoneNumber))));
            return updatedClients;
        });
    };
    const sendSMS = async (e) => {
        e.preventDefault();
        if(selectedClients.length < 1){
            toast.error("Select atleast one client");
        }else if(!message){
            toast.error("Write down a message for the client selected");
        }
        else{
            try {
                const {data}= await axios.post("/api/sms/rsw",{client:selectedClientsCell,message});
                toast.success(data.message);
                setClient("");
                setMessage("");
            } catch (error) {
                toast.error(error.message);
            }
        }
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName="sms" additonalRoute="water"></Breadcrumb>
            <div className="rounded-md border border-stroke bg-white p-5   mb-7  shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
                <Image width={140} height={140} className="m-auto" src={"/images/riverside-water-logo.png"} alt="Logo"></Image>
                <form onSubmit={(e)=>sendSMS(e)}>
                    <div className="px-6.5">
                        <label className="mb-2.5 text-black dark:text-white"> Client </label>
                        {clientsLoading && <div className="p-3">Loading clients...</div> }
                        <div className="relative z-20  bg-transparent dark:bg-form-input">
                            <div className={`relative max-h-[300px] overflow-y-auto z-20 w-full appearance-none ${dropOpen ? "bg-transparent" : "bg-blue-900"} rounded border text-white border-stroke px-5 py-3 outline-none transition active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}>
                                <button type="button" className={`${dropOpen ? "text-body": "text-white"} list-type-none dark:text-bodydark w-full`} onClick={()=>setDropOpen(!dropOpen)}>Select Client</button>
                                {dropOpen && (
                                    <div className="mt-3">
                                        <div className="border bg-slate-100 p-3">
                                            <input 
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAllChange}
                                            />
                                            <label className="ml-1 text-body dark:text-bodydark">Select All</label>
                                        </div>

                                        {/* Dynamically render checkboxes for each option */}
                                        {clients.length > 0 && clients.map((client) => (
                                            <div key={client._id} className="border-b p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.some(c => c._id ===  client._id)}
                                                    onChange={() => handleCheckboxChange(client)}
                                                />
                                                <label className="ml-1 text-body dark:text-bodydark">{client.firstName + " " + client.lastName}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className={`absolute right-4 ${dropOpen ? "top-6" : "top-1/2"} z-30 -translate-y-1/2`} onClick={()=>setDropOpen(!dropOpen)}>
                                <svg className="fill-current" color={`${dropOpen ? "" : "#fff"}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.8">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                    </g>
                                </svg>
                            </span>
                        </div>
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

export default RSW