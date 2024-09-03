"use client"
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const Loader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex">
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    <div className="relative flex flex-1 flex-col lg:ml-72.5">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    </div>
  </div>
    
  );
};

export default Loader;
