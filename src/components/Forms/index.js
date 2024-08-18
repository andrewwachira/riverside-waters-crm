"use client";
import {useState,useEffect} from 'react';
import DatePicker from '../FormElements/DatePicker/DatePicker';
import { useForm } from 'react-hook-form';
import { createClientForm1,getClients, saveFilterInfo } from '@/actions/server';

function Forms() {
    const {register,handleSubmit,formState:{errors}} = useForm();
    const {register:register3,handleSubmit:handleSubmit3,formState:{errors:errors3}} = useForm();
    const [clientFormOpen,setClientFormOpen] = useState(false); 
    const [filterFormOpen,setFilterFormOpen] = useState(false); 
    const [testFormOpen,setTestFormOpen] = useState(false); 
    const [inputRows, setInputRows] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [filterDates,setFilterDates] = useState([]);
    const [clients,setClients]  = useState([]);
    const [selectedClient,setSelectedClient] = useState("");
    const [selectClientErr,setSelectClientErr] = useState(false);
    const [hasSedimentFilter,setHasSedimentFilter] = useState(false);
    const [u3,setU3] = useState(false);
    const [ro,setRo] = useState(false);
    const [pc,setPc] = useState(false);
    const [rc,setRc] = useState(false);
    const [adminComments,setAdminComments]  = useState("");
    
    useEffect( ()=>{
        const fetchClients = async () => {
            const clients = await getClients();
            setClients(clients);
        }
     fetchClients()
     
    },[])

    const addRow = () =>{
        const newRow = {
            id:nextId,
            component: (
                <div className="mb-6 flex flex-col gap-6 xl:flex-row items-center justify-center" key={nextId}>
                    <div className="w-full xl:w-1/2">
                        <label name={`testName${nextId}`} re className="mb-3 block text-sm font-medium text-black dark:text-white">Test Name</label>
                        <input placeholder="Enter Test Name" className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text"/>
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label name={`testResult${nextId}`}className="mb-3 block text-sm font-medium text-black dark:text-white">Test Result</label>
                        <input placeholder="Enter Test Result" className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text"/>
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label name={`testFile${nextId}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Upload Test Result</label>
                        <input type="file" className="block w-full border-[1.5px] border-stroke bg-transparent  rounded p-1.5 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 "/>                           
                    </div>
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Action</label>
                        <button type='button' onClick={()=>setInputRows(inputRows.filter((row)=>(row.id !== nextId)))} className='text-white bg-rose-500 rounded-md py-3 px-5'>Remove</button>
                    </div>
                </div>
            )
        }
    setInputRows([...inputRows,newRow])
    setNextId(nextId+1); 
    }       
    
    const getDate= (date,inputName) => {
        setFilterDates(prevState =>  [...prevState,{filterName:inputName,date}]);
    }
   
    const handleClientRegistration = async({firstName,lastName,phoneNumber,residence,contactName,contactCell}) => {
        const saveClient = await createClientForm1(firstName,lastName,phoneNumber,residence,contactName,contactCell)
        // pop a notification telling the user that a client was registered
    }
    const handleFilterInfo = async(e) => {
        e.preventDefault()
        if(!selectedClient){
            setSelectClientErr(true);

        }
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
            clientID : selectedClient,
            clientName: clients.find(client=> client._id === selectedClient).firstName,
            sedimentFilter: hasSedimentFilter,
            u3_ChangeDate : filterDates.find(date=> date.filterName === "u3").date,
            ro_ChangeDate : filterDates.find(date=> date.filterName === "ro").date,
            pc_ChangeDate : filterDates.find(date=> date.filterName === "pc").date,
            rc_ChangeDate : filterDates.find(date=> date.filterName === "rc").date,
            adminComments
        }
        const res = await saveFilterInfo(filterData);
        if(res.status === 201)alert(res.message);

      }
    }
    const clearWarning = (filterName) => {
        if(filterName == "u3") setU3(false);
        if(filterName == "ro") setRo(false);
        if(filterName == "pc") setPc(false);
        if(filterName == "rc") setRc(false);
    }
  return (
    <div className="">
        <div className="flex m-5 flex-col gap-9">
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
                <form action="#" id="client-registration-form" onSubmit={handleSubmit(handleClientRegistration)} className={clientFormOpen ? `block` : "hidden"}>
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
                        <button type='submit' className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">Save Client</button>
                    </div>
                </form>
            </div>
        </div>
        <div className="flex m-5 flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div onClick={()=>setFilterFormOpen(!filterFormOpen)} className="border-b border-stroke px-6.5 py-4 bg-blue-800 rounded-md dark:border-strokedark flex justify-between">
                    <h3 className="font-medium text-white dark:text-white">FORM 2 - Filter Info Form</h3>
                    <div onClick={()=>setFilterFormOpen(!filterFormOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className={ !filterFormOpen ? `rotate-0 transition ease-in-out` : "rotate-45 transition ease-in-out"} color={"#fff"} fill={"none"}>
                            <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <form onSubmit={handleFilterInfo}  id="filter-change-form" className={filterFormOpen ? "block" : "hidden"}>
                    <div className=" p-6.5">
                            <label className="mb-2.5 block text-black dark:text-white"> Client </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                                <select  value={selectedClient} onChange={(e)=>{setSelectedClient(e.target.value);setSelectClientErr(false)}} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ">
                                    <option value="" disabled="" className="text-body dark:text-bodydark">Select Client</option>
                                    {
                                        clients.length > 0 && clients.map(client => (
                                            <option key={client._id} value={client._id} className="text-body dark:text-bodydark" >{client.firstName + " " + client.lastName}</option>
                                        ))
                                    }
                                </select>
                                <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.8">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                            {selectClientErr && <div className='text-rose-600'>Select the client the filter is for</div>}
                    </div>
                    <div className="p-6.5 flex items-center justify-between">
                       <label htmlFor="formCheckbox" className="flex cursor-pointer">
                            <div className="relative">
                                <input id="formCheckbox"  onChange={(e)=> setHasSedimentFilter(e.target.value == "on" ? true : false)} className="taskCheckbox sr-only" type="checkbox"/>
                                <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark">
                                    <span className="text-white opacity-0">
                                        <svg className="fill-current" width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z" fill="">
                                            </path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <p>Client has sediment filter?</p>
                        </label>
                    </div>
                    
                    <div className="p-6.5">
                        <div className="my-4.5"><DatePicker inputName="u3" getDatefn={getDate} Err={u3} clearWarning={clearWarning} labelName="ultra 3 filter Change Date"/></div>
                        <div className="my-4.5"><DatePicker inputName="ro" getDatefn={getDate} Err={ro} clearWarning={clearWarning} labelName="Reverse Osmosis Change Date"/></div>
                        <div className="my-4.5"><DatePicker inputName="pc" getDatefn={getDate} Err={pc} clearWarning={clearWarning} labelName="Post Carbon filter Change Date"/></div>
                        <div className="my-4.5"><DatePicker inputName="rc" getDatefn={getDate} Err={rc} clearWarning={clearWarning} labelName="Remineralyzing Cartilage Change Date"/></div> 
                        <div className="w-full my-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Admin Comments</label>
                                <input onChange={(e)=>setAdminComments(e.target.value)} name='adminComments' placeholder="Enter your comments/notes on this filter change" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text `}/>
                        </div>
                        <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90">Save Filter Info</button>
                    </div>
                </form>
            </div>
        </div>
        <div className="flex m-5 flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div onClick={()=>setTestFormOpen(!testFormOpen)} className="border-b border-stroke bg-blue-700 rounded-md text- px-6.5 py-4 dark:border-strokedark flex justify-between">
                    <h3 className="font-medium text-white dark:text-white">FORM 3 - Test results Form</h3>
                    <div onClick={()=>setTestFormOpen(!testFormOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className={ !testFormOpen ? `rotate-0 transition ease-in-out` : "rotate-45 transition ease-in-out"} color={"#fff"} fill={"none"}>
                            <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <form action="#" id="test-results-form" className={testFormOpen ? "block" : "hidden"}>
                    <div className=" p-6.5">
                            <label className="mb-2.5 block text-black dark:text-white"> Client </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                                <select className="relative z-20  w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ">
                                <option value="" disabled="" className="text-body dark:text-bodydark">Select Client</option>
                                    {
                                        clients?.map(client => (
                                            <option key={client._id} value={client.firstName} className="text-body dark:text-bodydark" >{client.firstName + " " + client.lastName}</option>
                                        ))
                                    }
                                </select>
                                <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.8">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                    </div>
                    
                    <div className="p-6.5">
                        <div className="mb-6 flex flex-col gap-6 xl:flex-row">
                            <div className="mb-4.5 w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Floride Test Results</label>
                                <input placeholder="Enter Floride test results" className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text"/>
                            </div>
                            <div className="mb-4.5 w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Upload Floride Test Results</label>
                                <input type="file" className="block w-full border-[1.5px] border-stroke bg-transparent  rounded p-1.5 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 "/>                           
                            </div>
                        </div>
                        <div className=' heading-separator'> Other Tests</div>
                        <div id="testInputParent">
                            {inputRows.map(row=> row.component)}
                        </div>
                        
                    
                        <button id="addInputButton" type='button' onClick={()=>addRow()} className="flex w-full justify-center rounded bg-white transition ease-in-out duration-500 text-orange-700 border border-orange-600 p-3 my-7 font-medium text-gray hover:bg-opacity-90 hover:bg-orange-600 hover:text-white">Add Test Field</button>
                        <button className="flex w-full justify-center rounded bg-primary p-3 my-7 font-medium text-gray hover:bg-opacity-90">Save Test Records</button>
                </div>
            </form>
        </div>
    </div>
</div>
  )
}

export default Forms