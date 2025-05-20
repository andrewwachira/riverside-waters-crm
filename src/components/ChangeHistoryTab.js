'use client';
import React, { useState } from 'react';

function ChangeHistoryTab({ filterInfo }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleShowHistory = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 mb-7 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Replacement History</h4>
      <div className='w-full mb-6'>
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 w-full">
          <div className="p-2.5 border-b border-stroke">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
          </div>
          <div className="p-2.5 border-b border-stroke">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Change Round</h5>
          </div>
          <div className="p-2.5 border-b border-stroke">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Filters Changed</h5>
          </div>
          <div className="p-2.5 border-b border-stroke">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Comments</h5>
          </div>
          <div className="p-2.5 border-b border-stroke">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Action</h5>
          </div>
        </div>

        {filterInfo?.map((filter, index) => (
          <div key={filter._id} className='w-full mb-6'>
            <div className={`grid grid-cols-5 rounded-sm bg-white dark:bg-meta-4 w-full`}>
              <div className="border-b border-stroke flex items-center justify-start p-2.5">
                <p className="text-black">{new Date(filter.updatedAt).toDateString()}</p>
              </div>
              <div className="border-b border-stroke flex items-center justify-start p-2.5">
                <p className="text-black">{filter.changeCycle}</p>
              </div>
              <div className="border-b border-stroke flex items-center justify-start p-2.5">
                <p className="text-black">
                  {filter?.filtersChanged?.map((item, i) => (
                    <span key={i} className='mx-1'>{item}</span>
                  ))}
                </p>
              </div>
              <div className="border-b border-stroke flex items-center justify-start p-2.5">
                <p className="text-black">{filter.comments || "_"}</p>
              </div>
              <div className="border-b border-stroke flex items-center justify-start p-2.5">
                <button className="text-blue-500 underline" onClick={() => handleShowHistory(index)}>
                  {openIndex === index ? "Collapse" : "Show"} Change History
                </button>
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="rounded-sm bg-gray-2 dark:bg-meta-4 w-full">
                <div className="p-2.5 border-b border-stroke">
                  <h5 className="text-sm font-medium text-center uppercase xsm:text-base">
                    Filter Change History ({new Date(filter.updatedAt).toDateString()})
                  </h5>
                </div>
                <div className="grid grid-cols-3 rounded-sm bg-white dark:bg-meta-4 w-full">
                  <div className="p-2.5 border-b border-stroke">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">Filter Name</h5>
                  </div>
                  <div className="p-2.5 border-b border-stroke">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">Previous Date</h5>
                  </div>
                  <div className="p-2.5 border-b border-stroke">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">Next Date</h5>
                  </div>
                </div>
                {filter.filterChangeHistory.map((item, i) => (
                  <div key={i} className="grid grid-cols-3 rounded-sm bg-white dark:bg-meta-4 w-full">
                    <div className="border-b border-stroke flex items-start justify-start p-2.5">
                      <p className="text-black">{item.filterName}</p>
                    </div>
                    <div className="border-b border-stroke flex items-start justify-start p-2.5">
                      <p className="text-black">{new Date(item.prevDate).toDateString()}</p>
                    </div>
                    <div className="border-b border-stroke flex items-start justify-start p-2.5">
                      <p className="text-black">{new Date(item.nextDate).toDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChangeHistoryTab;
