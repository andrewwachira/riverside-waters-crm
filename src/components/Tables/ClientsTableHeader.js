import React from 'react'

function ClientsTableHeader() {
  return (
    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 md:grid-cols-5">
        <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
                Name
            </h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
                Phone number
            </h5>
        </div>
        <div className="hidden p-2.5 text-center xl:p-5 md:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
                Residence
            </h5>
        </div>
        <div className="hidden p-2.5 text-center md:block  xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
                Contact Person
            </h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
                Action
            </h5>
        </div>
    </div>
  )
}

export default ClientsTableHeader