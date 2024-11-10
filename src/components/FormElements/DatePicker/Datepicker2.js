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
        <div className="flex mb-4 border border-transparent rounded-md w-fit flex-wrap">
            <div className="mx-2 text-sm p-3">
                <input ref={inputRef} id={inputName} type="radio" onChange={()=>getDatefn(3,inputName)} defaultValue={prevData === false ? undefined : prevData} name={inputName} className={`w-full rounded border-[1.5px] border-stroke bg-transparent p-5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${Err && "border-rose-500"}`} />
                <span>3 months </span>
            </div>
            <div className="mx-2 text-sm p-3">
                <input ref={inputRef} id={inputName} type="radio" onChange={()=>getDatefn(6,inputName)} defaultValue={prevData === false ? undefined : prevData} name={inputName} className={`w-full rounded border-[1.5px] border-stroke bg-transparent p-5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${Err && "border-rose-500"}`} />
                <span>6 months </span>
            </div>
            <div className="mx-2 text-sm p-3">
                <input ref={inputRef} id={inputName} type="radio" onChange={()=>getDatefn(12,inputName)} defaultValue={prevData === false ? undefined : prevData} name={inputName} className={`w-full rounded border-[1.5px] border-stroke bg-transparent p-5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${Err && "border-rose-500"}`} />
                <span>12 months </span>       
            </div>
            <div className="mx-2 text-sm p-3">
                <input ref={inputRef} id={inputName} type="radio" onChange={()=>getDatefn(18,inputName)} defaultValue={prevData === false ? undefined : prevData} name={inputName} className={`w-full rounded border-[1.5px] border-stroke bg-transparent p-5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${Err && "border-rose-500"}`} />
                <span>18 months </span>
            </div>
            <div className="mx-2 text-sm p-3">
                <input ref={inputRef} id={inputName} type="radio" onChange={()=>getDatefn(24)} defaultValue={prevData === false ? undefined : prevData} name={inputName} className={`w-full rounded border-[1.5px] border-stroke bg-transparent p-5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${Err && "border-rose-500"}`} />
                <span>24 months </span>
            </div>
        </div>
        {Err && <div className="text-rose-500">{labelName + " must not be empty"}</div>}
    </div>
  );
};

export default DatePicker2;
