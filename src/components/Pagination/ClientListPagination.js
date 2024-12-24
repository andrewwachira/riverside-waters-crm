"use client"
import {useState} from 'react'
import Link from 'next/link';

function ClientList({setPage,setLimit,page,limit,numClients}) {
    const [disablePrev,setDisablePrev] = useState(false);
    const [disableNext,setDisableNext] = useState(false);
    const lastPage = Math.ceil(numClients / limit);
    
    function handlePrev(){
        if(page <= 1){
            setDisablePrev(true);
            setDisableNext(false);
        }if(page !== 1){
            setPage(page-1);
            setDisablePrev(false);
            setDisableNext(false);
        }
    } 

    function handleNext(){
        if(page === lastPage){
            setDisableNext(true)
        }
        if(page !== lastPage){
            setPage(page + 1);
            setDisablePrev(false);
            setDisableNext(false);
        }

    } 
    return (
        <div className='flex items-center justify-end p-3 w-full'>
           displaying <form className='mx-2'>
                <select onChange={(e) => setLimit(e.target.value)}>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                </select>
            </form> records
            <p className='px-4 '>page {page} of {lastPage}</p>
            <div className='flex'>
                <Link href={`#`} onClick={handlePrev} className='px-2 '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={disablePrev ? "red" : "#63706B"} className="size-6 inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                <Link href={`#`}  onClick={handleNext}  className='px-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={disableNext ? "red" : "#63706B"} className="size-6 inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}

export default ClientList