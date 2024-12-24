"use client"
import {useEffect,useState} from 'react';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Link from 'next/link';
import { getClients2,searchClient} from '@/actions/server';
import ClientList from '@/components/Pagination/ClientListPagination';

function Clients() {
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const [searchTxt,setSearchTxt] = useState(null);
  const [search,setSearch] = useState(false);
  const [clients,setClients] = useState([]);
  const [numClients,setNumClients] = useState(0);
  const [page,setPage] = useState(1);
  const [limit,setLimit] = useState(25);
  const [showOptions,setShowOptions] = useState(false);
  const [filterType,setFilterType] = useState(null);

  useEffect(()=>{
    if(!filterType){
    async function getClientList() {
      setLoading(true)
      const {clients,numClients} = await getClients2(Number(page),Number(limit));
      if(clients?.length > 0 && numClients)setLoading(false);
      setClients(clients);
      setNumClients(numClients);
   }
   getClientList();
   }else{
    async function getfilteredClientList () {
      setLoading(true);
      const {clients,numClients} = await filteredClients(filterType);
    }
   // getfilteredClientList()
   }
  },[limit, page,filterType])

  const searchFunc = async(text) => {
      setLoading(true);
      const {searchResults} = await searchClient(text.charAt(0).toUpperCase() + text.slice(1),);
      console.log(searchResults);
      if(searchResults.length > 0){
        setError(false);
        setLoading(false);
        setSearch(true);
        setClients(searchResults);
      }else{
        setLoading(false);
        setSearch(true);
        setError("The search did not yield any results,clear your search and try again.");
      }
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Clients"/>
      <div className='flex flex-row-reverse'>
         <Link href="/dashboard/forms" className='rounded-md bg-blue-700 px-4 py-2 mb-4 hover:opacity-90 flex w-fit text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 inline" width={24} height={24} color={"#fff"} fill={"none"}>
              <path d="M14 12.6483L16.3708 10.2775C16.6636 9.98469 16.81 9.83827 16.8883 9.68032C17.0372 9.3798 17.0372 9.02696 16.8883 8.72644C16.81 8.56849 16.6636 8.42207 16.3708 8.12923C16.0779 7.83638 15.9315 7.68996 15.7736 7.61169C15.473 7.46277 15.1202 7.46277 14.8197 7.61169C14.6617 7.68996 14.5153 7.83638 14.2225 8.12923L11.8517 10.5M14 12.6483L5.77754 20.8708C5.4847 21.1636 5.33827 21.31 5.18032 21.3883C4.8798 21.5372 4.52696 21.5372 4.22644 21.3883C4.06849 21.31 3.92207 21.1636 3.62923 20.8708C3.33639 20.5779 3.18996 20.4315 3.11169 20.2736C2.96277 19.973 2.96277 19.6202 3.11169 19.3197C3.18996 19.1617 3.33639 19.0153 3.62923 18.7225L11.8517 10.5M14 12.6483L11.8517 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19.5 2.5L19.3895 2.79873C19.2445 3.19044 19.172 3.38629 19.0292 3.52917C18.8863 3.67204 18.6904 3.74452 18.2987 3.88946L18 4L18.2987 4.11054C18.6904 4.25548 18.8863 4.32796 19.0292 4.47083C19.172 4.61371 19.2445 4.80956 19.3895 5.20127L19.5 5.5L19.6105 5.20127C19.7555 4.80956 19.828 4.61371 19.9708 4.47083C20.1137 4.32796 20.3096 4.25548 20.7013 4.11054L21 4L20.7013 3.88946C20.3096 3.74452 20.1137 3.67204 19.9708 3.52917C19.828 3.38629 19.7555 3.19044 19.6105 2.79873L19.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M19.5 12.5L19.3895 12.7987C19.2445 13.1904 19.172 13.3863 19.0292 13.5292C18.8863 13.672 18.6904 13.7445 18.2987 13.8895L18 14L18.2987 14.1105C18.6904 14.2555 18.8863 14.328 19.0292 14.4708C19.172 14.6137 19.2445 14.8096 19.3895 15.2013L19.5 15.5L19.6105 15.2013C19.7555 14.8096 19.828 14.6137 19.9708 14.4708C20.1137 14.328 20.3096 14.2555 20.7013 14.1105L21 14L20.7013 13.8895C20.3096 13.7445 20.1137 13.672 19.9708 13.5292C19.828 13.3863 19.7555 13.1904 19.6105 12.7987L19.5 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10.5 2.5L10.3895 2.79873C10.2445 3.19044 10.172 3.38629 10.0292 3.52917C9.88629 3.67204 9.69044 3.74452 9.29873 3.88946L9 4L9.29873 4.11054C9.69044 4.25548 9.88629 4.32796 10.0292 4.47083C10.172 4.61371 10.2445 4.80956 10.3895 5.20127L10.5 5.5L10.6105 5.20127C10.7555 4.80956 10.828 4.61371 10.9708 4.47083C11.1137 4.32796 11.3096 4.25548 11.7013 4.11054L12 4L11.7013 3.88946C11.3096 3.74452 11.1137 3.67204 10.9708 3.52917C10.828 3.38629 10.7555 3.19044 10.6105 2.79873L10.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className='mx-2 inline '>Add Client</span>
          </Link>
      </div>
      <div className='lg:flex justify-between cursor-pointer'>
          <div  className="mb-6 text-xl text-center font-semibold text-black dark:text-white">Total clients in the System: {numClients}</div>

          <div className='flex rounded-md px-4 py-2 mb-4 hover:opacity-90 flex w-fit text-gray-500'>
            <div className="flex"onClick={()=>setShowOptions(!showOptions)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              <span className='mx-2' >
                Filter
              </span>
            </div>
            <select onChange={(e)=>setFilterType(e.target.value)}className={showOptions ? "block" : "hidden"}>
              <option value="" className="border bg-slate-100 p-3">Filter by...</option>
              <option value="year" className="border bg-slate-100 p-3">Filter by Year</option>
            </select>
          </div>
          
      </div>
      
      

      <div className='grid lg:grid-cols-2 justify-between items-center'>
        <form className='flex  items-center h-16'>
            <svg width="47" height="48.5" className='bg-white rounded-l-lg' viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
            <input onChange={(e)=>setSearchTxt(e.target.value)} type='search' className='w-full rounded-r-lg h-12 p-3' placeholder='search with first name'>
            
          </input>
          <button type='button' onClick={()=> searchTxt && searchFunc(searchTxt)} className='flex w-fit justify-center rounded-md bg-primary p-3 mx-1 h-12 my-7 font-medium text-gray hover:bg-opacity-90'>Search</button>
          { search && <button type='button' onClick={()=> window.location.reload()} className='flex w-fit justify-center rounded-md bg-rose-600 p-3 mx-1 h-12 my-7 font-medium text-gray hover:bg-opacity-90'>Clear</button>}
        </form>
        {!search && <ClientList setPage={setPage} setLimit={setLimit} page = {page} limit = {limit} numClients={numClients}/>}
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          All Clients
        </h4>

        { error ?
          <div className='rounded-md border border-orange-500 mb-5 w-full bg-orange-200'>
            <p className='p-5 text-center text-lg text-rose-700'>{error}</p>
          </div>:
        loading ? 
        <div className="flex h-fit py-10 items-center justify-center bg-white dark:bg-black">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
       : clients.length < 1 ? 
        <div className='rounded-md border border-rose-500 mb-5 w-full bg-rose-200'>
          <p className='p-5 text-center text-lg text-rose-700'>There are no clients registered yet.</p>
        </div>
        :
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 md:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Name
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Phone number
              </h5>
            </div>
            <div className="hidden p-2.5 text-center xl:p-5 md:block">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Residence
              </h5>
            </div>
            <div className="hidden p-2.5 text-center md:block  xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Contact Person
              </h5>
            </div>
          
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Action
              </h5>
            </div>
          </div>

          {clients.map((client, key) => (
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
        }
    </div>
    <div className='h-[50vh]'></div>
    </DefaultLayout>
  )
}

export default Clients