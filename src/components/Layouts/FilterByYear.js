"use client";
import React from 'react'
import ClientsTableHeader from '../Tables/ClientsTableHeader';
import Link from 'next/link';

function FilterByYear({clients,year}) {
    const clientsByMonth = Array.from({ length: 12 }, () => []); // Initialize an array with 12 empty arrays

    clients.forEach(client => {
    const month = new Date(client.dateOfInstallation).getMonth(); // Get the month (0 = January, 11 = December)
    clientsByMonth[month].push(client); // Add the client to the corresponding month bucket
    });

  return (

    <div>
        <div className='flex flex-col'>
            <div className='flex bg-orange-400 text-white justify-between p-5 items-end'>
                <h1 className='text-5xl p-2 text-center'>Year {year}</h1>
                <span className='text-center text-sm mb-3'>{clients.length} clients registered in total</span>
            </div>
            {clientsByMonth.map((clientsInMonth, index) => (
                <div key={index} className='mb-7' >
                    <div className='flex-col items-center flex bg-blue-600 text-white p-3'>
                        <h3 className='text-center text-3xl'>{new Date(0, index).toLocaleString('default', { month: 'long' })}</h3>
                        <span className='text-sm text-center text-white'>{clientsInMonth.length} clients registered</span>
                    </div>
                    <ClientsTableHeader/>
                    {clientsInMonth.map((client,key) => (
                        <div className={`grid grid-cols-3 sm:grid-cols-5 ${ key === clients.length - 1 ? "" : "border-b border-stroke dark:border-strokedark" }`} key={key}>
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black dark:text-white sm:block">
                                {client.firstName + " " + client.lastName}
                                </p>
                            </div>
            
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{client.phoneNumber}</p>
                            </div>
                
                            <div className="hidden items-center justify-center md:block p-2.5 xl:p-5">
                                <p className="text-black text-center dark:text-white">{client.residence}</p>
                            </div>
                
                            <div className="hidden items-center justify-center p-2.5 md:block xl:p-5">
                                <p className="text-black text-center dark:text-white">{client.contactPerson?.name ? client.contactPerson?.name : "-" }</p>
                            </div>
                
                            <div className="items-center justify-center p-2.5 sm:flex xl:p-5">
                                <Link href={`/dashboard/clients/${client._id}/`} className="text-meta-5 underline">More Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
  )
}

export default FilterByYear