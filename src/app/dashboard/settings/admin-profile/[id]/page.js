import React from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

function AdminProfile() {
  return (
    <DefaultLayout>
        <Breadcrumb pageName={"settings"} additonalRoute={"admin-profile"}/>
        
    </DefaultLayout>
  )
}

export default AdminProfile