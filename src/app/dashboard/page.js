import React from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import DashboardUI from '@/components/Dashboard/DashboardUI'
function Dashboard() {
  return (
    <DefaultLayout>
      <DashboardUI/>
      <div className='h-[50vh]'></div>
    </DefaultLayout>
  )
}

export default Dashboard