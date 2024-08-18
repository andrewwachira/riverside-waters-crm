"use client"
import { useEffect ,useRef} from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

const DatePicker = ({labelName,inputName,getDatefn,Err,clearWarning,prevData}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        mode: "single",
        static: true,
        monthSelectorType: "static",
        dateFormat: "M j, Y",
        prevArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onChange: (selectedDates, dateStr) => {getDatefn(dateStr, inputName),clearWarning(inputName)},
        
      });
    }
  }, [getDatefn, inputName,clearWarning,prevData]);
  

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {labelName}
      </label>
      <div className="relative">
          <input ref={inputRef} id={inputName} defaultValue={prevData === false ? undefined : prevData} name={inputName} className={`w-full rounded border-[1.5px] border-stroke bg-transparent p-5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${Err && "border-rose-500"}`} placeholder="mm/dd/yyyy" data-class="flatpickr-right" />
          <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z" fill="#64748B"/>
            </svg>
          </div>
      </div>
      {Err && <div className="text-rose-500">{labelName + " must not be empty"}</div>}
    </div>
  );
};

export default DatePicker;
