import React from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'

function EditFilterInfo() {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="clients" additonalRoute="Edit Filter Info"/>
    </DefaultLayout>

  )
}

export default EditFilterInfo