"use client"
import { useEffect ,useRef} from "react";
import "flatpickr/dist/flatpickr.css";

const DatePicker2 = ({labelName,inputName,getDatefn,Err,clearWarning,prevData}) => {
  const inputRef = useRef(null);
  

  return (
    <div>
        <label className="mb-3 block text-sm  font-medium text-black dark:text-white">
            {labelName}
        </label>
        <div className="flex mb-4 border border-transparent rounded-md flex-wrap">
            <p className="text-sm px-5 ">Select a replacement period</p>
            <div className="mx-2 text-sm p-3 w-full flex items-center justify-between bg-white dark:bg-form-input rounded-md ">
                <select onChange={(e)=>getDatefn(e.target.value,inputName)} defaultValue={prevData === false ? undefined : prevData} name={inputName} className={`relative z-20 w-full px-5 py-3  rounded border bg-primary border-stroke bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${Err && "border-rose-500"}`}>
                    <option value="">Select</option>  
                    {[...Array(24).keys()].map((item) => {
                        return <option key={item} value={item + 1}>{item + 1} {item < 1 ? "month" : "months"}</option>
                    })}
                </select>
            </div>
            
        </div>
        {Err && <div className="text-rose-500">{labelName + " must not be empty"}</div>}
    </div>
  );
};

export default DatePicker2;
