import React from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'

function EditClientInfo() {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="clients" additonalRoute="edit-client-info" />
    </DefaultLayout>
  )
}

export default EditClientInfo