import React from 'react'
import {useState,useEffect} from 'react';
import DatePicker2 from '../FormElements/DatePicker/Datepicker2';
import { getClients, saveFilterInfo, getFilterData } from '@/actions/server';
import useColorMode from '@/hooks/useColorMode';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import FullInstallation from '../FormElements/FilterElements/FullInstallation';
import SelectiveInstallation from '../FormElements/FilterElements/SelectiveInstallation';

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
    const [filters,setFilters] = useState([]);
    const [selectionComplete,setSelectionComplete] = useState(false);
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
            // console.error("Error calculating next date:", error);
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
            if (installationRound) {
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
            <form onSubmit={handleFilterInfo}  id="filter-change-form"className={`overflow-hidden transition-all duration-500 ease-in-out ${ filterFormOpen ? "max-h-[15000px] opacity-100" : "max-h-0 opacity-0" }`}>
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
               
                { selectedClient && !selectionComplete &&
                <div className="p-6.5">
                    <p>Which Filters of {selectedClient?.firstName} {selectedClient.lastName} would you like to change ? </p>
                        <div className=" mt-4">
                            <div className='p-4.5 w-full border border-stroke my-2 rounded-md hover:bg-stone-50 dark:border-strokedark dark:bg-form-input'>
                                <input type="checkbox" id="u3" name="u3" value="u3" checked={filters.includes("u3")} onChange={(e)=>{setFilters(prevState => e.target.checked ?  [...prevState,  e.target.value] : prevState.filter(item=> item !== e.target.value))}} className="mr-2"/>
                                <label htmlFor="u3" className="text-sm font-medium text-black dark:text-white">Ultra 3 Filter</label>
                            </div>
                            <div className='p-4.5 w-full border border-stroke my-2 rounded-md hover:bg-stone-50 dark:border-strokedark dark:bg-form-input'>
                                <input type="checkbox" id="ro" name="ro" value="ro" checked={filters.includes("ro")} onChange={(e)=>{setFilters(prevState => e.target.checked ?  [...prevState,  e.target.value] : prevState.filter(item=> item !== e.target.value))}} className="mr-2"/>
                                <label htmlFor="ro" className="text-sm font-medium text-black dark:text-white">Reverse Osmosis Filter</label>
                            </div>
                            <div className='p-4.5 w-full border border-stroke my-2 rounded-md hover:bg-stone-50 dark:border-strokedark dark:bg-form-input'>
                                <input type="checkbox" id="pc" name="pc" value="pc" checked={filters.includes("pc")} onChange={(e)=>{setFilters(prevState => e.target.checked ?  [...prevState,  e.target.value] : prevState.filter(item=> item !== e.target.value))}} className="mr-2"/>
                                <label htmlFor="pc" className="text-sm font-medium text-black dark:text-white">Post Carbon Filter</label>
                            </div>
                            <div className='p-4.5 w-full border border-stroke my-2 rounded-md hover:bg-stone-50 dark:border-strokedark dark:bg-form-input'>
                                <input type="checkbox" id="rc" name="rc" value="rc" checked={filters.includes("rc")} onChange={(e)=>{setFilters(prevState => e.target.checked ?  [...prevState,  e.target.value] : prevState.filter(item=> item !== e.target.value))}} className="mr-2"/>
                                <label htmlFor="rc" className="text-sm font-medium text-black dark:text-white">Remineralizing Cartilage Filter</label>
                            </div>
                            <div className="flex items-center justify-between">
                                <button type="button" onClick={()=>{ filters.length > 0 ? setSelectionComplete(true) : toast.error("Choose the filter(s) that should be replaced / installed")}} className="m-4.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90">Done</button>
                                {filters.length > 0 && <button type="button" onClick={()=>{setFilters([])}} className="m-4.5 flex w-full justify-center rounded bg-danger p-3 font-medium text-white hover:bg-opacity-90">Clear All</button>}
                            </div>
                            
                        </div>
                </div>
                }
                {selectionComplete && filters?.length > 0 &&
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
                        <FullInstallation getDate={getDate} selectedClient={selectedClient} clearWarning={clearWarning} FormErrors={FormErrors} filterDates={filterDates} handleFilterInfo={handleFilterInfo} calculateNextDate={calculateNextDate} setAdminComments={setAdminComments}/>
                    ) : <div className='p-6.5'>
                            <SelectiveInstallation prevFilterFormData={prevFilterFormData} setPcOpen={setPcOpen} setRcOpen={setRcOpen} setRoOpen={setRoOpen} setU3Open={setU3Open} RcOpen={RcOpen} RoOpen={RoOpen} u3Open={u3Open} PcOpen={PcOpen} filters={filters} getDate={getDate} clearWarning={clearWarning} FormErrors={FormErrors} filterDates={filterDates} handleFilterInfo={handleFilterInfo} calculateNextDate={calculateNextDate} setAdminComments={setAdminComments} />
                        </div>
                }
            </form>
        </div>
    </div>
    )
}

export default FilterForm