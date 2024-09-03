"use client";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function ForgotPassword() {
    const {handleSubmit,register,formState:errors} = useForm();
    const [message,setMessage] = useState(null);
    const [loading,setLoading] = useState(false);

    const handleForgotPassword =  async({email}) => {
        await sendResestLink();
    }
  return (   
    <main className="flex min-h-screen flex-col justify-between p-8">
        <h1 className={`text-5xl p-3 text-center  text-blue-500 `}>Riverside Water</h1>
        <Link className="mb-5.5 inline-block mx-auto" href="/">
            <Image className="hidden dark:block" src={"/images/riverside-water-logo.png"} alt="Logo" width={176} height={32}/>
            <Image className="dark:hidden" src={"/images/riverside-water-logo.png"} alt="Logo" width={176} height={32} />
        </Link>
        <div className="rounded-lg w-1/2  m-auto border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-center">
                <div className="w-full">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                        <h2 className="mb-9 text-2xl font-bold text-black  sm:text-title-xl2">Forgot Password</h2>
                        {message && <div className="w-fit border border-green-600 rounded-md m-auto my-3 bg-green-200 p-3 text-green-800">{message}</div>}
                        <form onSubmit={handleSubmit(handleForgotPassword)}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black "> Email </label>
                                <div className="relative">
                                    <input type="email" placeholder="Enter your email" name="email" {...register("email",{required:"Email is required", pattern: {value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]+$|^([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\.[a-zA-Z]{2,})$/i }, message:"Please enter a valid email address"})}className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.email && "border-rose-600"}`} />
                                    <span className="absolute right-4 top-4">
                                        <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                        <g opacity="0.5">
                                            <path d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z" fill=""/>
                                        </g>
                                        </svg>
                                    </span>
                                </div>
                                {errors.email && (<div className="text-rose-500">{errors.email.message}</div>)}
                            </div>
                            <button className={`mb-5 w-full cursor-pointer rounded-lg border bg-blue-500 p-4 ${loading && "pointer-events-none"}`}>
                                <input type="submit" value={ loading ? "loading..." : "Send reset link"} className=" text-white hover:bg-opacity-90" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  </main>
  )
}

export default ForgotPassword