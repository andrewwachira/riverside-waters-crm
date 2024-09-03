import React from 'react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
function ChangePassword() {
  return (
    <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName={"profile"} additonalRoute={'change-password'} />
          
        </div>
    </DefaultLayout>
  )
}

export default ChangePassword