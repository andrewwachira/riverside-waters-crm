"use client";
import {useState,useEffect} from 'react';
import DatePicker from '../FormElements/DatePicker/DatePicker';
import DatePicker2 from '../FormElements/DatePicker/Datepicker2';
import { useForm } from 'react-hook-form';
import { createClientForm1,getClients, saveFilterInfo, saveTestInfo } from '@/actions/server';
import useColorMode from '@/hooks/useColorMode';
import { UploadButton } from '@/lib/utils/uploadthing';
import toast from 'react-hot-toast';

function Forms() {
    const [colorMode, setColorMode] = useColorMode();
    const {register,handleSubmit,formState:{errors},reset} = useForm();
    const {register:register3,handleSubmit:handleSubmit3,formState:{errors:errors3}} = useForm();
    const [clientFormOpen,setClientFormOpen] = useState(false); 
    const [filterFormOpen,setFilterFormOpen] = useState(false); 
    const [testFormOpen,setTestFormOpen] = useState(false); 
    const [inputRows, setInputRows] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [filterDates,setFilterDates] = useState([]);
    const [clients,setClients]  = useState([]);
    const [clientsLoading,setClientsLoading]  = useState(false);
    const [selectedClient,setSelectedClient] = useState("");
    const [selectClientErr,setSelectClientErr] = useState(false);
    const [hasSedimentFilter,setHasSedimentFilter] = useState(false);
    const [doi,setDoi] = useState(false);
    const [doiErr,setDoiErr] = useState(false);
    const [u3,setU3] = useState(false);
    const [ro,setRo] = useState(false);
    const [pc,setPc] = useState(false);
    const [rc,setRc] = useState(false);
    const [tD,setTd] = useState(false);//test Date error
    const [adminComments,setAdminComments]  = useState("");
    const [fTFile,setFTFile] = useState(null);
    const [fTDate,setFTDate] = useState(null);
    const [testFiles,setTestFiles] = useState([]);
    const [testNames,setTestNames] = useState([]);
    const [testResults,setTestResults] = useState([]);
    const [testDates,setTestDates] = useState([]);
    const [trigger,setTrigger] = useState(false);
    const [changeCycle,setChangeCycle] = useState(null);
    const [changeCycleErr,setChangeCycleErr] = useState(null);
    const [preFilter,setPreFilter] = useState(null);

    useEffect( ()=>{
        const fetchClients = async () => {
            setClientsLoading(true);
            const clients = await getClients();
            setClients(clients);
            setClientsLoading(false);
        }
     fetchClients()
     
    },[colorMode,trigger])
    // console.log(testNames,testResults,testDates);
    const addRow = () =>{
        const newRow = {
            id:nextId,
            component: (
                <div className="mb-6 flex flex-col gap-6 xl:grid xl:grid-cols-2 items-center justify-center" key={nextId}>
                    <div className="mb-4.5 w-full ">
                        <DatePicker inputName={`testDate${nextId}`} nextId={nextId} labelName={`Test Date`}  getTestDateFn={(date)=>getTestDateFn(date,nextId)} />
                    </div>
                    <div className="w-full ">
                        <label name={`testName${nextId}`}  className="mb-3 block text-sm font-medium text-black dark:text-white">Test Name</label>
                        <input placeholder="Enter Test Name" onChange={(e)=>setTestNames([...testNames,{testName:e.target.value, testId:nextId}])} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text"/>
                    </div>
                    <div className="w-full">
                        <label name={`testResult${nextId}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Test Result</label>
                        <input placeholder="Enter Test Result" onChange={(e)=>setTestResults([...testResults,{testResult:e.target.value, testId:nextId}])} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text"/>
                    </div>
                    <div className="w-full ">
                        <label name={`testFile${nextId}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Upload Test Result</label>
                        <UploadButton  className="block ut-allowed-content:float-right w-full border-[1.5px] border-stroke bg-transparent  rounded p-1.5 text-sm text-slate-500 ut-button:mr-4 ut-button:py-2 ut-button:px-4 ut-button:rounded-full ut-button:border-0 ut-button:text-sm ut-button:font-semibold ut-button:bg-violet-50 ut-button:text-violet-700 hover:ut-button:bg-violet-100 " endpoint="imageUploader" onClientUploadComplete={(res) => {
                        setTestFiles([...testFiles,{testFileUrl:res,testId:nextId}]);
                        alert("Upload Completed");
                        }}
                        onUploadError={(error) => {
                        alert(`ERROR! ${error.message}`);
                        }}
                        />
                    </div>
                    
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Action</label>
                        <button type='button' onClick={()=>{setInputRows(prevState => prevState.filter((row)=>(row.id !== nextId))); setNextId(inputRows.length)}} className='text-white bg-rose-500 rounded-md py-3 px-5'>Remove</button>
                    </div>
                </div>
            )
        }
    setInputRows([...inputRows,newRow])
    setNextId(nextId+1); 
    }       
    //the function below gathers date inputs for all the 4 filters. 
    const getDate= (date,inputName) => {
        setFilterDates(prevState =>  [...prevState,{filterName:inputName,date}]);
    }
    //DOI means Date of Installation. A date that could be in the future,present or past.
    const getDOIDate= (date) => {
        setDoi(date);
    }
    const getFTDate= (date) => {
        setFTDate(date);
    }
    const getTestDateFn= (date,nextId) => {
        if(!date) setTd(true);
        else setTestDates(prev => [...prev,{testDate:date, testId:nextId}]);
    }
   
    const handleClientRegistration = async({firstName,lastName,phoneNumber,residence,contactName,contactCell}) => {
        if(!doi){
            setDoiErr(true);
            return
        }
        const saveClient = await createClientForm1(firstName,lastName,phoneNumber,residence,contactName,contactCell,doi);
        if (saveClient.status === 201) {
            setTrigger(true);
            reset();
            setClientFormOpen(false);
            toast.success("Client created successfully");
        }else{
            toast.error(saveClient.error)
        }
    }
    const handleFilterInfo = async(e) => {
        e.preventDefault()
        if(!selectedClient){
            setSelectClientErr(true);
            return
        }
        if(!changeCycle){
            setChangeCycleErr(true);
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
                preFilter,
                u3_ChangeDate : filterDates.find(date=> date.filterName === "u3").date,
                ro_ChangeDate : filterDates.find(date=> date.filterName === "ro").date,
                pc_ChangeDate : filterDates.find(date=> date.filterName === "pc").date,
                rc_ChangeDate : filterDates.find(date=> date.filterName === "rc").date,
                changeCycle,
                adminComments
            }
            const res = await saveFilterInfo(filterData);
            if(res.status === 201){
                toast.success(res.message);
                setFilterFormOpen(false);
                setFilterDates([]);
                setTimeout(()=>window.location.reload(),1500);
            }
        }
    }
    const clearWarning = (filterName) => {
        if(filterName == "u3") setU3(false);
        if(filterName == "ro") setRo(false);
        if(filterName == "pc") setPc(false);
        if(filterName == "rc") setRc(false);
    }
    const handleTestForm = async({rawFT,treatedFT,fTFile,testClient,})=> { 
        const groupedDataMap = new Map();// Initialize an empty Map to store data grouped by testId
        const addToGroupedData = (array, key) => {// Helper function to add items to the Map by testId
            array.forEach(item => {
                const { testId, ...rest } = item; // Separate testId from the other data fields
                if (!groupedDataMap.has(testId)) {
                groupedDataMap.set(testId, { testId }); // Initialize entry if not present
                }
                Object.assign(groupedDataMap.get(testId), rest); // Merge data fields
            });
        };
        // Populate the Map with data from each array
        addToGroupedData(testDates, "testDate");
        addToGroupedData(testNames, "testName");
        addToGroupedData(testResults, "testResult");
        addToGroupedData(testFiles, "testFile");
        // Convert the Map into an array of objects
        const groupedTests = Array.from(groupedDataMap.values());
        const res = await saveTestInfo(rawFT,treatedFT,fTFile,groupedTests,testClient);
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
                            <input name="contactName" {...register("contactName",)}  placeholder="Enter Client's contact person" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.contactName && "border-danger"}`} type="text"/>
                            {errors.contactName && <div className='text-rose-500'>{errors?.contactName?.message}</div>}
                        </div>
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Contact Person Phone Number</label>
                            <input name="contactCell" {...register("contactCell")}  placeholder="0720-123-123" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors?.contactCell && "border-danger"}`} type="tel"/>
                            {errors.contactCell && <div className='text-rose-500'>{errors?.contactCell?.message}</div>}
                        </div>
                        <div className="mb-4.5">
                            <div className="my-4.5"><DatePicker inputName="doi"  getDatefn={getDOIDate} Err={doiErr} clearWarning={clearWarning} labelName="Date of Installation"/></div>   
                        </div>
                        <button type='submit' className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">Save Client</button>
                    </div>
                </form>
            </div>
        </div>

    {/* Filter form ============================================================================================================================================*/}
        
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

                    <div className="p-6.5">
                        <p className="mb-2.5 block text-black dark:text-white">Pre Filter</p>
                        <div className='flex mt-3'>
                            <div className='m-1 flex flex-col-reverse'>
                                <label htmlFor='formRadio1'>Yes</label>
                                <input id="formRadio1" name="preFilter"  onChange={(e)=> setPreFilter(true)} type="radio"/>
                            </div>
                            <div className="m-1 ml-5 flex flex-col-reverse">
                                <label htmlFor='formRadio2'>No</label>
                                <input id="formRadio2" name="preFilter" onChange={(e)=> setPreFilter(false)} type="radio"/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6.5">
                        <div className="my-4.5"><DatePicker2 inputName="u3" getDatefn={getDate} Err={u3} clearWarning={clearWarning} labelName="ultra 3 filter Change Date"/></div>
                        <div className="my-4.5"><DatePicker2 inputName="ro" getDatefn={getDate} Err={ro} clearWarning={clearWarning} labelName="Reverse Osmosis Change Date"/></div>
                        <div className="my-4.5"><DatePicker2 inputName="pc" getDatefn={getDate} Err={pc} clearWarning={clearWarning} labelName="Post Carbon filter Change Date"/></div>
                        <div className="my-4.5"><DatePicker2 inputName="rc" getDatefn={getDate} Err={rc} clearWarning={clearWarning} labelName="Remineralyzing Cartilage Change Date"/></div> 
                        
                        <div className='my-4.5'>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Select Change Cycle</label>
                            <select  onChange={(e)=>setChangeCycle(e.target.value)}  className={`relative z-20 w-full  rounded border border-stroke px-5 py-3 outline-none transition active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}>
                                    <option value={null} >Select...</option>      
                                    <option value="Installation">Installation</option>      
                                    {[...Array(10).keys()].map(key=> (
                                        <option value={key+1} key={key}>Filter Change {key + 1}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="w-full my-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Admin Comments </label>
                                <input onChange={(e)=>setAdminComments(e.target.value)} name='adminComments' placeholder="Notes for this filter change e.g 'First installation', 'first filter change cycle'" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text `}/>
                        </div>
                        <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90">Save Filter Info</button>
                    </div>
                </form>
            </div>
        </div>

    {/* Test Form=================================================================================================================================== */}
    
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
                <form onSubmit={handleSubmit3(handleTestForm)}  id="test-results-form" className={testFormOpen ? "block" : "hidden"}>
                    <div className=" p-6.5">
                        <label className="mb-2.5 block text-black dark:text-white"> Client </label>
                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                            <select {...register3("testClient",{required:"this field is required"})}className="relative z-20  w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ">
                                <option value="" disabled="" className="text-body dark:text-bodydark">Select Client</option>
                                    {
                                        clientsLoading ?
                                        <option>Loading data..</option>
                                        :
                                        clients.length < 1 ?
                                        <option className='rounded-md border border-rose-500 mb-5 w-full bg-rose-200'><p className='p-5 text-center text-lg text-rose-700'>No Client has been registered yet.</p></option>
                                        :
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
                        {errors3?.testClient && <div className='text-rose-500'>{errors3?.testClient?.message}</div>}
                    </div>
              
                    <div className="p-6.5">
                        <div className='heading-separator mb-7'>Floride Tests</div>
                        <div className="mb-6  flex-col gap-6 xl:grid xl: grid-cols-2">
                            <div className="mb-4.5 w-full ">
                                <DatePicker inputName="FTD" labelName="Floride Test Date" getDatefn={getFTDate}/>
                            </div>
                            <div className="mb-4.5 w-full">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white"> Raw Floride Test</label>
                                <input placeholder="Enter Raw Floride results" {...register3("rawFT")} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text"/>
                                {errors3?.rawFT && <div className='text-rose-500'>{errors3?.rawFT?.message}</div>}
                            </div>
                            <div className="mb-4.5 w-full">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Treated Floride Test </label>
                                <input placeholder="Enter Treated Floride results" {...register3("treatedFT")} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text"/>
                                {errors3?.treatedFT && <div className='text-rose-500'>{errors3?.treatedFT?.message}</div>}
                            </div>
                            <div className="mb-4.5 w-full">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Upload Floride Test Results</label>
                                <UploadButton  className="block ut-allowed-content:float-right w-full border-[1.5px] border-stroke bg-transparent  rounded p-1.5 text-sm text-slate-500 ut-button:mr-4 ut-button:py-2 ut-button:px-4 ut-button:rounded-full ut-button:border-0 ut-button:text-sm ut-button:font-semibold ut-button:bg-violet-50 ut-button:text-violet-700 hover:ut-button:bg-violet-100 dark:border-form-strokedark" endpoint="imageUploader" 
                                onClientUploadComplete={(res) => {setFTFile(res);alert("Upload Completed");
                                    }} onUploadError={(error) => {
                                    alert(`ERROR! ${error.message}`);
                                    }}
                                />                            
                            </div>
                        </div>
                        <div className='heading-separator'> Other Tests</div>
                        <div id="testInputParent">
                            {inputRows.map(row=> row.component)}
                        </div>
                        <button id="addInputButton" type='button' onClick={()=>addRow()} className="flex w-full justify-center rounded bg-orange-200 transition ease-in-out duration-500 text-orange-700 border border-orange-600 p-3 my-7 font-medium text-gray hover:bg-opacity-90  hover:bg-orange-600 hover:text-white">Add Test Field</button>
                        <button type='submit'  className="flex w-full justify-center rounded bg-primary p-3 my-7 font-medium text-gray hover:bg-opacity-90">Save Test Records</button>
                </div>
            </form>
        </div>
    </div>
    <div className='h-[50vh]'></div>
</div>
  )
}

export default Forms