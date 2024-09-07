"use client";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DarkModeSwitcher from '@/components/Header/DarkModeSwitcher';
import { useEffect, useState} from 'react';
import avatar from "../../../../public/images/avatar.png";
import toast from 'react-hot-toast';
import SwitcherThree from '@/components/Switchers/SwitcherThree';
import { setGoogleSignIn,removeAdminSlot,addAdminSlot } from '@/actions/server';
import Link from 'next/link';
import Warning from '@/components/Modals/Warning';
import Image from 'next/image';

function Settings() {

  const [theme,setTheme] = useState(() => {
    const initialValue = "light"
    if (typeof window !== 'undefined') {
      
      const localStorageValue = window.localStorage.getItem("color-theme");
      return localStorageValue !== null ? JSON.parse(localStorageValue) : initialValue;
    }
    return initialValue});
    const [systemSettings,setSystemSettings] = useState(null);
    const [accounts,setAccounts] = useState([]);
    const [loggedUser,setLoggedUser] = useState(null);
    const [showOptions,setShowOptions] = useState(false);
    const [optionId,setOptionId] = useState(null);
    const [confirmDelete,setConfirmDelete] = useState(false);
    const [warning,setWarning] = useState(false);
    const [warningMessage,setWarningMessage] = useState(null);

    const onRequestClose = () => {
      setWarning(false);
      setWarningMessage("");
    }
    useEffect(()=>{
     async function getSettings() {
        const sysRes = await fetch("/api/system/getSettings");
        const settings = await sysRes.json();
        const res = await fetch("/api/userInfo");
        const data = await res.json();
        setLoggedUser(data);
        setSystemSettings(settings.system);
        setAccounts(settings.users);
     }
     getSettings()
    },[]);

    const handleAddAdminSlot = async (e) => {
      e.preventDefault();
     if(loggedUser.isSuperAdmin){
       toast.error("Only Root admin can add admin slots to the system");
     } else{
      const res = await addAdminSlot();
      if(res.status == 200) toast.success("Admin Slot removed successfully");
      else toast.error(res.error);
     }
    }
    const handleRemoveAdminSlot = async (e) => {
      e.preventDefault();
     if(!loggedUser.isSuperAdmin){
       toast.error("Only Root admin can add admin slots to the system");
     }
     if(accounts.length >= systemSettings.adminAccounts){
        toast.error("Delete an admin account first");
     } else{
        const res = await removeAdminSlot()
        if(res.status == 200) toast.success("Admin Slot removed successfully");
        else toast.error(res.error);
     }
    }

    const enableGoogleSignin = async (enabled) => {
      const res = await setGoogleSignIn(enabled);
      if(res.status === 200){
        toast.success("Google Signin Changed");
      }else{
        toast.error(res.error);
      }
    }

    const handleDeleteAdmin = async (id,name) => {
      if(!loggedUser.isSuperAdmin){
        toast.error("Only Root admin can add admin slots to the system");
      }
      setWarning(true);
      setWarningMessage(`Are you sure you want to permanently delete ${name} from the system?`);
      if(confirmDelete){
        onRequestClose();
        const res = await deleteAdmin(id,loggedUser.email);
        if(res.status === 200){
        toast.success("Google Signin Changed");
        }else{
          toast.error(res.error);
        }
      }
    }
  return (
    <DefaultLayout>
      <Breadcrumb pageName={`settings`}/>
      {warning && <Warning onRequestClose={onRequestClose} message={warningMessage} setConfirmDelete={setConfirmDelete} />}
      <form>
        <div className="rounded-md border border-stroke bg-white px-5 pb-2.5 mb-7 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h1 className='text-2xl mb-2 text-bold'>Accounts</h1>
          <div className='p-3'> 
          <div className="w-full flex mb-4 rounded-md border border-stroke py-2.5 dark:border-strokedark">
          { accounts.length < 1 ? 
            <div className="flex h-full items-center justify-center bg-white dark:bg-black">
              <div className="h-16 my-3 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              <span className="m-3">Loading...</span>
            </div>
          : 
          accounts.map(account => (
            <div className="flex flex-col" key={account._id}>
              <div className="flex items-center justify-between p-4.5 hover:bg-[#F9FAFB] dark:hover:bg-meta-4">
                <div className="flex items-center">
                  <div className="mr-4 h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
                    <Image  alt="user"  loading="lazy"  width="50"  height="50"  decoding="async"  data-nimg="1"  className="rounded-full object-cover object-center"  src={`${account.image ? account.image : avatar.src}`}  style={{color: "transparent", width: "auto", height: "auto"}} />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-black dark:text-white">{account.name}</h4>
                    <p className="text-sm">{account.isSuperAdmin ? "Root Admin" : "Sub admin"}</p>
                  </div>
                </div>
                <div>
                  <div className="relative flex">
                    <button type='button' onClick={()=> {setShowOptions(!showOptions);setOptionId(account._id)}}>
                      <svg className="fill-current"  width="21"  height="21"  viewBox="0 0 21 21"  fill="none"  xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5326 16.0338C12.5326 15.1133 11.7864 14.3671 10.8659 14.3671C9.94541 14.3671 9.19922 15.1133 9.19922 16.0338C9.19922 16.9542 9.94541 17.7004 10.8659 17.7004C11.7864 17.7004 12.5326 16.9542 12.5326 16.0338Z"  fill=""></path>
                        <path d="M12.5326 10.2005C12.5326 9.28005 11.7864 8.53385 10.8659 8.53385C9.94541 8.53385 9.19922 9.28005 9.19922 10.2005C9.19922 11.121 9.94541 11.8672 10.8659 11.8672C11.7864 11.8672 12.5326 11.121 12.5326 10.2005Z"  fill=""></path>
                        <path d="M12.5326 4.36702C12.5326 3.44655 11.7864 2.70036 10.8659 2.70036C9.94541 2.70036 9.19922 3.44655 9.19922 4.36703C9.19922 5.2875 9.94541 6.03369 10.8659 6.03369C11.7864 6.03369 12.5326 5.2875 12.5326 4.36702Z"  fill=""></path>
                      </svg>
                    </button>
                    <div className={`absolute right-0 top-full z-40 w-37.5 space-y-1 rounded bg-white p-2 shadow-card dark:bg-boxdark-2 ${showOptions && optionId == account._id ? "block" :  "hidden"}`}>
                      <Link  href={`/dashboard/settings/admin-profile/${account._id}`}className="w-full rounded px-3 py-1.5 text-left text-sm hover:bg-gray-2 dark:hover:bg-graydark">View</Link>
                      <span onClick={()=>handleDeleteAdmin(account._id,account.name)} className="w-full rounded px-3 py-1.5 text-left text-sm hover:bg-gray-2 dark:hover:bg-graydark">Delete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>))
             }
          </div>

            <div className='flex items-center'> 
              <p className='my-3'>Maximus Admins allowed in the System :</p>
              <span className='ml-2'>{systemSettings?.adminAccounts ? systemSettings?.adminAccounts : "Loading data..." }</span>
            </div>
            <button  onClick={(e)=>handleAddAdminSlot(e)} className='w-fit justify-center rounded bg-primary p-3 my-7 font-medium text-gray hover:bg-opacity-90'> Add Admin Slot</button>
            <button  onClick={(e)=>handleRemoveAdminSlot(e)} className='ml-3 w-fit justify-center rounded bg-danger p-3 my-7 font-medium text-gray hover:bg-opacity-90'> Remove Admin Slot</button>
          </div>
        </div>
        <div className="rounded-md border border-stroke bg-white px-5 pb-2.5 mb-7 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
          <h1  className='text-2xl mb-2 text-bold'>Security</h1>
          <div className='flex items-center p-3'>
            <p className='m-3'>Enable Google Sign in</p>
            <SwitcherThree defaultChoice={systemSettings?.googleSignIn} enableGoogleSignin={enableGoogleSignin} ></SwitcherThree>
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