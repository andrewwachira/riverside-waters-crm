
import DatePicker2 from "../DatePicker/Datepicker2";
import moment from "moment";

function FullInstallation({getDate, FormErrors, clearWarning, handleFilterInfo, selectedClient, filterDates, setAdminComments,calculateNextDate}) {
  return (
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
  )
}

export default FullInstallation