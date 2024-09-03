"use client";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DarkModeSwitcher from '@/components/Header/DarkModeSwitcher';
import SwitcherOne from '@/components/Switchers/SwitcherOne';
import { useState} from 'react';

function Settings() {
  const [theme,setTheme] = useState(() => {
    const initialValue = "light"
    if (typeof window !== 'undefined') {
      
      const localStorageValue = window.localStorage.getItem("color-theme");
      return localStorageValue !== null ? JSON.parse(localStorageValue) : initialValue;
    }
    return initialValue});
    
  return (
    <DefaultLayout>
      <Breadcrumb pageName={`settings`}/>
      <form>
        <div className="rounded-md border border-stroke bg-white px-5 pb-2.5 mb-7 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h1 className='text-2xl mb-2 text-bold'>Accounts</h1>
          <div className='p-3'>
            <div className='border rounded-md p-2 w-fit dark:border-form-strokedark'>
              <p>Rose Muriuki</p>
            </div>
          </div>
          <div className='p-3'> 
            <div className='flex border-t dark:border-form-strokedark items-center'> 
              <p className='my-3'>Maximus Admins allowed in the System :</p>
              <span className='ml-2'>1</span>
            </div>
            <button className='w-fit justify-center rounded bg-primary p-3 my-7 font-medium text-gray hover:bg-opacity-90'> Add Admin Slot</button>
          </div>
        </div>
        <div className="rounded-md border border-stroke bg-white px-5 pb-2.5 mb-7 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h1  className='text-2xl mb-2 text-bold'>Security</h1>
          <div className='flex items-center p-3'>
            <p className='m-3'>Enable Google Sign in</p>
            <SwitcherOne></SwitcherOne>
          </div>
        </div>
        <div className="rounded-md border border-stroke bg-white px-5 pb-2.5 mb-7 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h1  className='text-2xl mb-2 text-bold'>Theme</h1>
          <div className='flex items-center'>
            <p className='m-3 p-3'>Change theme to {theme === "light" ? "dark" : "light"}</p>
            <DarkModeSwitcher setTheme={setTheme} />
          </div>
        </div>
      </form>
    </DefaultLayout>
  )
}

export default Settings;