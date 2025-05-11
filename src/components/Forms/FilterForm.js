import React from 'react'
import {useState,useEffect} from 'react';
import DatePicker2 from '../FormElements/DatePicker/Datepicker2';
import { getClients, saveFilterInfo, getFilterData } from '@/actions/server';
import useColorMode from '@/hooks/useColorMode';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';

function FilterForm() {
    const {colorMode} = useColorMode();
    const [filterFormOpen,setFilterFormOpen] = useState(false); 
    const [selectedClient,setSelectedClient] = useState("");
    const [clientsLoading,setClientsLoading] = useState(false);
    const [clients,setClients] = useState([]);
    const [prevFilterFormData,setPrevFilterFormData] = useState([]);
    const [filterDataLoading,setFilterDataLoading] = useState(false);
    const [u3Open,setU3Open] = useState(false);
    const [RoOpen,setRoOpen] = useState(false);
    const [PcOpen,setPcOpen] = useState(false);
    const [RcOpen,setRcOpen] = useState(false);
    const [changeCycle,setChangeCycle] = useState("");
    const [adminComments,setAdminComments] = useState("");
    const [filterDates,setFilterDates] = useState([]);
    const [FormErrors, setFormErrors] = useState({
        selectClient: false,
        changeCycle: false,
        u3: false,
        ro: false,
        pc: false,
        rc: false,
      });
 
    useEffect( ()=>{
        try {
            const fetchData = async () => {
                setClientsLoading(true);
                const clients = await getClients();
                setClients(clients);
                setClientsLoading(false);
            }
            fetchData();
            if(selectedClient?._id){
                const fetchClientFilters = async () =>{
                    const {data} = await getFilterData(selectedClient?._id);
                    setPrevFilterFormData(data);
                }
                fetchClientFilters();
            }
        } catch (error) {
          toast.error("Error fetching clients: " + error.message);  
        }
       
        
    },[colorMode,filterFormOpen,selectedClient?._id]
    )

    //the function below gathers date inputs for all the 4 filters. 
    const getDate = (date, inputName) => {
        setFilterDates(prevState => {
          // Check if this filter already exists in the array
          const filterIndex = prevState.findIndex(item => item.filterName === inputName);
          
          // If found, create a new array with the updated item
          if (filterIndex !== -1) {
            const newArray = [...prevState];
            newArray[filterIndex] = { filterName: inputName, date };
            return newArray;
          } 
          // If not found, add it as a new item
          else {
            return [...prevState, { filterName: inputName, date }];
          }
        });
        // Clear the error for this input name whenever a date is selected
        clearWarning(inputName);
    };
      // This function will clear warnings for a specific field or all fields
    const clearWarning = (field = null) => {
        if (field) {
        // Clear specific warning
        setFormErrors(prev => ({
            ...prev,
            [field]: false
        }));
        } else {
        // Clear all warnings if no field specified
        setFormErrors({
            selectClient: false,
            changeCycle: false,
            u3: false,
            ro: false,
            pc: false,
            rc: false,
            // reset all other error fields too
        });
        }
    };
    // Function to set a specific warning
    const setWarning = (field) => {
        setFormErrors(prev => ({
          ...prev,
          [field]: true
        }));
    };
      
    const calculateNextDate = (installationDate, monthsToAdd) => {
    if (!installationDate || !monthsToAdd) return "Not set";
    
        try {
            // Parse the installation date (handles both string dates and Date objects)
            const baseDate = moment(installationDate);
            
            // Check if the date is valid
            if (!baseDate.isValid()) return "Invalid date";
            
            // Add the selected number of months and format the result
            return baseDate.add(monthsToAdd, 'months').format('MMM DD, YYYY');
        } catch (error) {
            console.error("Error calculating next date:", error);
            return "Error calculating date";
        }
    };
  
    const handleFilterInfo = async (e) => {
     e.preventDefault();
        // Reset all errors first
        const newErrors = {
            selectClient: false,
            changeCycle: false,
            u3: false,
            ro: false,
            pc: false,
            rc: false
        };
        let hasErrors = false;
        
        if(!selectedClient || selectedClient === ""){
            newErrors.selectClient = true;
            hasErrors = true;
            return;
        }
        if(!changeCycle || changeCycle === ""){
            newErrors.changeCycle = true;
            hasErrors = true;
            return;
        }
        else if (changeCycle === "Installation"){
            // Check all required filter types
            const requiredFilters = ['u3', 'ro', 'pc', 'rc'];
            const clientFilters = prevFilterFormData;
            const installationRound = clientFilters.find(entry => entry.changeCycle === "Installation");
            if (!installationRound) {
                toast.error("You have selected the wrong change cycle for the client. The client's filter data are past the installation round.");
                return;
            }
            requiredFilters.forEach(filter => {
                if (!filterDates.some(item => item.filterName === filter)) {
                    newErrors[filter] = true;
                    hasErrors = true;
                }
            });
            // Update error state with new validation results
            setFormErrors(newErrors);
            
            // If there are errors, stop form submission
            if (hasErrors) {
                toast.error("Please fill in all required fields");
                return;
            }
             // Proceed with form submission if no errors
                try {
                    // Create the filter info object based on the selected change cycle
                    const filterInfo = {
                        clientId: selectedClient._id,
                        changeCycle: changeCycle,
                        changeCycleIndex: 0,
                        filtersChanged: filterDates.map(item => item.filterName),
                        filterChangeHistory: filterDates.map(item => ({
                            filterName: item.filterName,
                            prevDate: selectedClient?.dateOfInstallation,
                            nextDate: calculateNextDate(selectedClient?.dateOfInstallation, item.date)
                        })),
                        adminId: selectedClient._id,
                        // Extract dates for each filter from filterDates array
                        u3: calculateNextDate(selectedClient?.dateOfInstallation,filterDates.find(item => item.filterName === "u3")?.date || 0),
                        ro: calculateNextDate(selectedClient?.dateOfInstallation,filterDates.find(item => item.filterName === "ro")?.date || 0),
                        pc: calculateNextDate(selectedClient?.dateOfInstallation,filterDates.find(item => item.filterName === "pc")?.date || 0),
                        rc: calculateNextDate(selectedClient?.dateOfInstallation,filterDates.find(item => item.filterName === "rc")?.date || 0),
                        adminComments: adminComments
                    };
                    const res = await saveFilterInfo(filterInfo);
                    if (res.status === 201) {
                    toast.success("Filter Info Saved Successfully");
                    setFilterFormOpen(false);
                    setSelectedClient("");
                    setChangeCycle("");
                    setFilterDates([]);
                    setAdminComments("");
                    } else {
                        toast.error(`Error Saving Filter Info: ${res.message || "Unknown error"}`);
                    }
                } catch (error) {
                    toast.error("An error occurred while saving filter information");
                }

        }else {
            // Proceed with form submission if no errors
                const latestFilter = prevFilterFormData[prevFilterFormData.length - 1];
                if (!latestFilter) {
                    toast.error("You have selected the wrong change cycle for the client.There is no previous filter data available. The next filter change cycle should be Installation.");
                    return;
                }
                if (latestFilter.changeCycleIndex+1 !==  parseInt(changeCycle.match(/\d+/)[0])) {
                    toast.error(`You have selected the wrong change cycle for the client. The next filter change cycle shound be round ${latestFilter.changeCycleIndex + 1}`);
                    return;
                }
                try {
                    // Create the filter info object based on the selected change cycle
                    const filterInfo = {
                    clientId: selectedClient._id,
                    changeCycle: changeCycle,
                    changeCycleIndex: parseInt(changeCycle.match(/\d+/)[0]),
                    filtersChanged: filterDates.map(item => item.filterName),
                    filterChangeHistory: filterDates.map(item => ({
                        filterName: item.filterName,
                        prevDate: moment(latestFilter[item.filterName + "_ChangeDate"]).format("MM-DD-YYYY"),
                        nextDate: calculateNextDate(latestFilter[item.filterName + "_ChangeDate"], item.date)
                    })),
                    // Extract dates for each filter from filterDates array
                    u3: calculateNextDate(latestFilter.u3_ChangeDate,filterDates.find(item => item.filterName === "u3")?.date || Date(latestFilter.u3_ChangeDate)),
                    ro: calculateNextDate(latestFilter.ro_ChangeDate,filterDates.find(item => item.filterName === "ro")?.date || Date(latestFilter.ro_ChangeDate)),
                    pc: calculateNextDate(latestFilter.pc_ChangeDate,filterDates.find(item => item.filterName === "pc")?.date || Date(latestFilter.pc_ChangeDate)),   
                    rc: calculateNextDate(latestFilter.rc_ChangeDate,filterDates.find(item => item.filterName === "rc")?.date || Date(latestFilter.rc_ChangeDate)),               
                    adminComments: adminComments
                    };
                    console.log(filterInfo);
                    const res = await saveFilterInfo(filterInfo);
                    if (res.status === 201) {
                    toast.success("Filter Info Saved Successfully");
                    setFilterFormOpen(false);
                    setSelectedClient("");
                    setChangeCycle("");
                    setFilterDates([]);
                    setAdminComments("");
                    } else {
                        toast.error(`Error Saving Filter Info: ${res.message || "Unknown error"}`);
                    }
                } catch (error) {
                    toast.error("An error occurred while saving filter information");
                }
        } 
    }
  return (
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
            <form onSubmit={handleFilterInfo}  id="filter-change-form"className={`overflow-hidden transition-all duration-500 ease-in-out ${ filterFormOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0" }`}>
                <div className=" p-6.5">
                        <label className="mb-2.5 block text-black dark:text-white"> Client </label>
                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                            <select  value={selectedClient ? JSON.stringify(selectedClient) : ""} onChange={(e)=>{setSelectedClient(e.target.value ? JSON.parse(e.target.value) : ""); clearWarning("selectClient");}} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ">
                                <option value="" disabled="" className="text-body dark:text-bodydark">Select Client</option>
                                { clientsLoading ? 
                                    <option value={0} disabled className="text-body dark:text-bodydark" >Loading Clients...</option>
                                   : clients.length > 0 && clients.map(client => (
                                        <option key={client._id} value={JSON.stringify(client)} className="text-body dark:text-bodydark" >{client.firstName + " " + client.lastName}</option>
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
                        {FormErrors.selectClient && (<div className="text-rose-500 text-sm mt-1">Please select a client</div>)}
                </div>
               
                { selectedClient && 
                <div className='p-6.5'>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Select Change Cycle</label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select  onChange={(e)=>{setChangeCycle(e.target.value);clearWarning("changeCycle");setFilterDates([])}}  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}>
                                <option value="" >Select...</option>      
                                {filterDataLoading && <option value={0} disabled className="text-body dark:text-bodydark" >Loading Filter Data...</option>}
                                <option disabled= {prevFilterFormData.find(entry => entry.changeCycle === "Installation") ? true : false} value="Installation">Installation</option>      
                                {[...Array(10).keys()].map(key=> (
                                    <option disabled={key+1 <= prevFilterFormData[prevFilterFormData.length-1]?.changeCycleIndex ? true : false} value={key+1} key={key}>Filter Change {key + 1}</option>
                                ))}
                        </select>
                        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.8">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                </g>
                            </svg>
                        </span>
                    </div>
                    {FormErrors.changeCycle && <p className='text-rose-600'>You need to select a filter change round</p>}
                </div>
                }
                
                {
                
                    !changeCycle ?
                    null :
                    changeCycle === "Installation" ? (
                        <div className="p-6.5">
                            {/* u3 */}
                            <div className="my-4.5 flex wrap items-center justify-between">
                                <div className="flex-2 min-w-[400px]">
                                    <DatePicker2 inputName="u3" getDatefn={getDate} Err={FormErrors.u3} clearWarning={() => clearWarning("u3")} labelName="ultra 3 filter Installation Date" prevData={filterDates.find(x => x.filterName === "u3")}/>
                                </div>
                                <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                                    <div className="text-sm flex align-items justify-around">
                                        <div>
                                            <div className="font-medium mb-1">Current Installation:</div> 
                                            <div>{selectedClient?.dateOfInstallation ? moment(selectedClient.dateOfInstallation).format('MMM DD, YYYY') : "Not set"}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                            <div className={`${filterDates.find(x=>x.filterName === "u3") ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                                {filterDates.find(x => x.filterName === "u3") 
                                                ? calculateNextDate(selectedClient?.dateOfInstallation, filterDates.find(x => x.filterName === "u3").date)
                                                : "Select a replacement period"}
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            {FormErrors.u3 && ( <div className="text-rose-500 text-sm mt-1 mb-3">Please select a replacement period for Ultra 3 Filter</div>)}
                            <hr/>
                            {/* ro */}
                            <div className="my-4.5 flex wrap items-center justify-between">
                                <div className="flex-1 min-w-[200px]">
                                    <DatePicker2 inputName="ro" getDatefn={getDate} Err={FormErrors.ro} clearWarning={() => clearWarning("ro")} labelName="Reverse Osmosis Filter Installation Date" prevData={filterDates.find(x => x.filterName === "ro")}/>
                                </div>
                                <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                                    <div className="text-sm flex align-items justify-around">
                                        <div>
                                            <div className="font-medium mb-1">Current Installation:</div> 
                                            <div>{selectedClient?.dateOfInstallation ? moment(selectedClient.dateOfInstallation).format('MMM DD, YYYY') : "Not set"}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                            <div className={`${filterDates.find(x=>x.filterName === "ro") ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                                {filterDates.find(x => x.filterName === "ro") 
                                                ? calculateNextDate(selectedClient?.dateOfInstallation, filterDates.find(x => x.filterName === "ro").date)
                                                : "Select a replacement period"}
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            {FormErrors.ro && ( <div className="text-rose-500 text-sm mt-1 mb-3">Please select a replacement period for Reverse Osmosis</div>)}
                            <hr/>
                            {/* pc */}
                            <div className="my-4.5 flex wrap items-center justify-between">
                                <div className="flex-1 min-w-[200px]">
                                    <DatePicker2 inputName="pc" getDatefn={getDate} Err={FormErrors.pc} clearWarning={() => clearWarning("pc")} labelName="Post Carbon Filter Installation Date" prevData={filterDates.find(x => x.filterName === "pc")}/>
                                </div>
                                <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                                    <div className="text-sm flex align-items justify-around">
                                        <div>
                                            <div className="font-medium mb-1">Current Installation:</div> 
                                            <div>{selectedClient?.dateOfInstallation ? moment(selectedClient.dateOfInstallation).format('MMM DD, YYYY') : "Not set"}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                            <div className={`${filterDates.find(x=>x.filterName === "pc") ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                                {filterDates.find(x => x.filterName === "pc") 
                                                ? calculateNextDate(selectedClient?.dateOfInstallation, filterDates.find(x => x.filterName === "pc").date)
                                                : "Select a replacement period"}
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            {FormErrors.pc && ( <div className="text-rose-500 text-sm mt-1 mb-3">Please select a replacement period for Post Carbon Filter</div>)}
                            <hr/>
                            {/* rc */}
                            <div className="my-4.5 flex wrap items-center justify-between">
                                <div className="flex-1 min-w-[200px]">
                                    <DatePicker2 inputName="rc" getDatefn={getDate} Err={FormErrors.rc} clearWarning={() => clearWarning("rc")} labelName="Remineralyzing Cartilage Installation Date" prevData={filterDates.find(x => x.filterName === "rc")}/>
                                </div>
                                <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                                    <div className="text-sm flex align-items justify-around">
                                        <div>
                                            <div className="font-medium mb-1">Current Installation:</div> 
                                            <div>{selectedClient?.dateOfInstallation ? moment(selectedClient.dateOfInstallation).format('MMM DD, YYYY') : "Not set"}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                            <div className={`${filterDates.find(x=>x.filterName === "rc") ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                                {filterDates.find(x => x.filterName === "rc") 
                                                ? calculateNextDate(selectedClient?.dateOfInstallation, filterDates.find(x => x.filterName === "rc").date)
                                                : "Select a replacement period"}
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            {FormErrors.rc && ( <div className="text-rose-500 text-sm mt-1 mb-3">Please select a replacement period for Remineralizing Cartilage</div>)}
                            <hr/>
                            <div className="w-full my-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Admin Comments </label>
                                <input onChange={(e)=>setAdminComments(e.target.value)} name='adminComments' placeholder="Notes for this filter change e.g 'First installation', 'first filter change cycle'" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text `}/>
                            </div>
                            <button type="submit" onSubmit={handleFilterInfo} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90">Save Filter Info</button>
                        </div>
                    ) : <div className='p-6.5'>
                            <div>
                                {/* u3 tab */}
                                <div className='mb-4'>
                                    <div onClick={()=>setU3Open(!u3Open)} className={`w-full border border-stroke bg-blue-50 ${u3Open ? "rounded-t-md" : "rounded-md"}  flex justify-between items-center p-5 font-medium focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}>
                                        <p>Ultra 3 Filter </p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className={ !u3Open ? `rotate-0 transition ease-in-out` : "rotate-45 transition ease-in-out"} color={"none"} fill={"none"}>
                                            <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out border border-stroke border-b-md ${  u3Open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0" }`}>
                                        <div className="m-4.5 flex wrap items-center justify-between">
                                            <div className="flex-1 min-w-[200px]">
                                                <DatePicker2 inputName="u3" getDatefn={getDate} Err={FormErrors.u3} clearWarning={() => clearWarning("u3")} labelName="Ultra 3 Filter Installation Date" prevData={filterDates.find(x => x.filterName === "u3")}/>
                                            </div>
                                            <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                                                <div className="text-sm flex align-items justify-around">
                                                    <div>
                                                        <div className="font-medium mb-1">Current Installation:</div> 
                                                        <div>{prevFilterFormData[prevFilterFormData.length-1]?.u3_ChangeDate ? moment(prevFilterFormData[prevFilterFormData.length-1]?.u3_ChangeDate).format('MMM DD, YYYY') : "Not set"}</div>
                                                    </div>
                                            
                                                    <div>
                                                        <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                                        <div className={`${filterDates.find(x=>x.filterName === "u3") ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                                            {filterDates.find(x => x.filterName === "u3") 
                                                            ? calculateNextDate(prevFilterFormData[prevFilterFormData.length-1]?.u3_ChangeDate, filterDates.find(x => x.filterName === "u3").date)
                                                            : "Select a replacement period"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                       
                                        <div className="w-full p-4.5">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Admin Comments </label>
                                            <input onChange={(e)=>setAdminComments(e.target.value)} name='adminComments' placeholder="Notes for this filter change e.g 'First installation', 'first filter change cycle'" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text `}/>

                                            <button type='submit' onClick={handleFilterInfo} className='flex w-full justify-center rounded bg-primary mt-4.5 p-3 font-medium text-white hover:bg-opacity-90'>Save Ultra 3 Filter Date</button>
                                        </div>
                                    </div>
                                </div>
                                {/* RO tab */}
                                <div className='mb-4'>
                                    <div onClick={()=>setRoOpen(!RoOpen)} className={`w-full border border-stroke bg-blue-50 ${RoOpen ? "rounded-t-md" : "rounded-md"}  flex justify-between items-center p-5 font-medium focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}>
                                        <p>Reverse Osmosis</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className={ !RoOpen ? `rotate-0 transition ease-in-out` : "rotate-45 transition ease-in-out"} color={"none"} fill={"none"}>
                                            <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out border border-stroke rounded-b-md ${ RoOpen ? "max-h-[550px] opacity-100" : "max-h-0 opacity-0" }`}>
                                        <div className="m-4.5 flex wrap items-center justify-between">
                                            <div className="flex-1 min-w-[200px]">
                                                <DatePicker2 inputName="ro" getDatefn={getDate} Err={FormErrors.ro} clearWarning={() => clearWarning("ro")} labelName="Reverse Osmosis Filter Installation Date" prevData={filterDates.find(x => x.filterName === "ro")}/>
                                            </div>
                                            <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                                                <div className="text-sm flex align-items justify-around">
                                                    <div>
                                                        <div className="font-medium mb-1">Current Installation:</div> 
                                                        <div>{prevFilterFormData[prevFilterFormData.length-1]?.ro_ChangeDate ? moment(prevFilterFormData[prevFilterFormData.length-1]?.ro_ChangeDate).format('MMM DD, YYYY') : "Not set"}</div>
                                                    </div>
                                            
                                                    <div>
                                                        <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                                        <div className={`${filterDates.find(x=>x.filterName === "ro") ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                                            {filterDates.find(x => x.filterName === "ro") 
                                                            ? calculateNextDate(prevFilterFormData[prevFilterFormData.length-1]?.ro_ChangeDate, filterDates.find(x => x.filterName === "ro").date)
                                                            : "Select a replacement period"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full p-4.5">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Admin Comments </label>
                                            <input onChange={(e)=>setAdminComments(e.target.value)} name='adminComments' placeholder="Notes for this filter change e.g 'First installation', 'first filter change cycle'" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text `}/>
                                            <button type='submit' className='flex w-full justify-center rounded bg-primary mt-4.5 p-3 font-medium text-white hover:bg-opacity-90'>Save Reverse Osmosis Filter Date</button>
                                        </div>
                                    </div>
                                </div>
                                {/* PC tab */}
                                <div className='mb-4'>
                                    <div onClick={()=>setPcOpen(!PcOpen)} className={`w-full border border-stroke bg-blue-50 ${PcOpen ? "rounded-t-md" : "rounded-md"} flex justify-between items-center p-5 font-medium focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}>
                                        <p>Post Carbon</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className={ !PcOpen ? `rotate-0 transition ease-in-out` : "rotate-45 transition ease-in-out"} color={"none"} fill={"none"}>
                                            <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out border border-stroke rounded-b-md ${ PcOpen ? "max-h-[550px] opacity-100" : "max-h-0 opacity-0" }`}>
                                        <div className="m-4.5 flex wrap items-center justify-between">
                                            <div className="flex-1 min-w-[200px]">
                                                <DatePicker2 inputName="pc" getDatefn={getDate} Err={FormErrors.pc} clearWarning={() => clearWarning("pc")} labelName="Post Carbon Filter Installation Date" prevData={filterDates.find(x => x.filterName === "pc")}/>
                                            </div>
                                            <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                                                <div className="text-sm flex align-items justify-around">
                                                    <div>
                                                        <div className="font-medium mb-1">Current Installation:</div> 
                                                        <div>{prevFilterFormData[prevFilterFormData.length-1]?.pc_ChangeDate ? moment(prevFilterFormData[prevFilterFormData.length-1]?.pc_ChangeDate).format('MMM DD, YYYY') : "Not set"}</div>
                                                    </div>
                                            
                                                    <div>
                                                        <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                                        <div className={`${filterDates.find(x=>x.filterName === "pc") ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                                            {filterDates.find(x => x.filterName === "pc") 
                                                            ? calculateNextDate( prevFilterFormData[prevFilterFormData.length-1]?.pc_ChangeDate, filterDates.find(x => x.filterName === "pc").date)
                                                            : "Select a replacement period"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full p-4.5">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Admin Comments </label>
                                            <input onChange={(e)=>setAdminComments(e.target.value)} name='adminComments' placeholder="Notes for this filter change e.g 'First installation', 'first filter change cycle'" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text `}/>
                                            <button type='submit' className='flex w-full justify-center rounded bg-primary mt-4.5 p-3 font-medium text-white hover:bg-opacity-90'>Save Post Carbon Filter Date</button>
                                        </div>
                                    </div>
                                </div>
                                {/* RC tab */}
                                <div className='mb-4'>
                                    <div onClick={()=>setRcOpen(!RcOpen)} className={`w-full border border-stroke bg-blue-50 font-white ${RcOpen ? "rounded-t-md" : "rounded-md"} flex justify-between items-center p-5 font-medium focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}>
                                        <p>Remineralizing Cartilage </p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className={ !RcOpen ? `rotate-0 transition ease-in-out` : "rotate-45 transition ease-in-out"} color={"none"} fill={"none"}>
                                            <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out border border-stroke rounded-b-md ${ RcOpen ? "max-h-[550px] opacity-100" : "max-h-0 opacity-0" }`}>
                                        <div className="m-4.5 flex wrap items-center justify-between">
                                            <div className="flex-1 min-w-[200px]">
                                                <DatePicker2 inputName="rc" getDatefn={getDate} Err={FormErrors.rc} clearWarning={() => clearWarning("rc")} labelName="Remineralyzing Cartilage Installation Date" prevData={filterDates.find(x => x.filterName === "rc")}/>
                                            </div>
                                            <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                                                <div className="text-sm flex align-items justify-around">
                                                    <div>
                                                        <div className="font-medium mb-1">Current Installation:</div> 
                                                        <div>{prevFilterFormData[prevFilterFormData.length-1]?.rc_ChangeDate ? moment(prevFilterFormData[prevFilterFormData.length-1]?.rc_ChangeDate).format('MMM DD, YYYY') : "Not set"}</div>
                                                    </div>
                                            
                                                    <div>
                                                        <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                                        <div className={`${filterDates.find(x=>x.filterName === "rc") ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                                            {filterDates.find(x => x.filterName === "rc") 
                                                            ? calculateNextDate(prevFilterFormData[prevFilterFormData.length-1]?.rc_ChangeDate, filterDates.find(x => x.filterName === "rc").date)
                                                            : "Select a replacement period"}
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full p-4.5">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Admin Comments </label>
                                            <input onChange={(e)=>setAdminComments(e.target.value)} name='adminComments' placeholder="Notes for this filter change e.g 'First installation', 'first filter change cycle'" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text `}/>
                                            <button type='submit' className='flex w-full justify-center rounded bg-primary mt-4.5 p-3 font-medium text-white hover:bg-opacity-90'>Save Remineralizing Cartilage Filter Date</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </form>
        </div>
    </div>
    )
}

export default FilterForm