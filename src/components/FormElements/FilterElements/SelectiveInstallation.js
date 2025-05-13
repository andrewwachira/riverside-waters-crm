import DatePicker2 from "../DatePicker/Datepicker2";
import moment from 'moment'

function SelectiveInstallation({prevFilterFormData,filters,setPcOpen,setRcOpen,setRoOpen,setU3Open,RcOpen,u3Open,PcOpen,RoOpen,getDate, FormErrors, clearWarning, handleFilterInfo, filterDates, setAdminComments,calculateNextDate}) {
   
    const obj = {
        u3: "Ultra 3 Filter",
        ro: "Reverse Osmosis",
        pc: "Post Carbon",
        rc: "Remineralizing Cartilage"
    }
    const obj2 = {
        u3: "u3_ChangeDate",
        ro: "ro_ChangeDate",
        pc: "pc_ChangeDate",
        rc: "rc_ChangeDate"
    }
    const createDynamicJSX = (filters) => {
        return(
            filters.map((f) => (
                <div key={f} className='mb-4'>
                    <div className="m-4.5 flex wrap items-center justify-between">
                        <div className="flex-1 min-w-[200px]">
                            <DatePicker2 inputName={f} getDatefn={getDate} Err={FormErrors?.[f]} clearWarning={() => clearWarning(f)} labelName={`${obj[f]} Filter Installation Date`} prevData={filterDates.find(x => x.filterName === f)}/>
                        </div>
                        <div className="flex-1 min-w-[200px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md ml-4">
                            <div className="text-sm flex align-items justify-around">
                                <div>
                                    <div className="font-medium mb-1">Current Installation:</div> 
                                    <div>{prevFilterFormData[prevFilterFormData.length-1]?.u3_ChangeDate ? moment(prevFilterFormData[prevFilterFormData.length-1]?.u3_ChangeDate).format('MMM DD, YYYY') : "Not set"}</div>
                                </div>
                        
                                <div>
                                    <div className="font-medium mt-2 mb-1">Next Replacement:</div>
                                    <div className={`${filterDates.find(x=>x.filterName === f) ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-medium`}>
                                        {filterDates.find(x => x.filterName === "u3") 
                                        ? calculateNextDate(prevFilterFormData[prevFilterFormData.length-1]?.[obj2[f]], filterDates.find(x => x.filterName === f)?.date)
                                        : "Select a replacement period"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        )
        
    }
  return (
    <div>
        {
            filters.length === 1 && filters.find((f)=>f === "u3") ?
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
            :
            filters.length === 1 && filters.find((f)=>f === "ro") ? 
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
            :  filters.length === 1 && filters.find((f)=>f === "pc") ?  
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
            : filters.length === 1 && filters.find((f)=>f === "rc") ?
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
            :  filters.length > 1 && 
            <div>
                {createDynamicJSX(filters)}
                <div className="w-full p-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Admin Comments </label>
                    <input onChange={(e)=>setAdminComments(e.target.value)} name='adminComments' placeholder="Notes for this filter change e.g 'First installation', 'first filter change cycle'" className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" type="text `}/>
                    <button type='submit' onClick={handleFilterInfo} className='flex w-full justify-center rounded bg-primary mt-4.5 p-3 font-medium text-white hover:bg-opacity-90'>Save Filter Dates</button>
                </div>
            </div>
        }
    </div>
  )
}

export default SelectiveInstallation