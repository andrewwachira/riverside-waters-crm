"use client"
import React from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useSearchParams } from 'next/navigation'
function Page() {
    const searchParams = useSearchParams();
    const set = searchParams.get("set");
    
    console.log(set);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="clients" additonalRoute=".../ Change account Status"/>

        </DefaultLayout>
  )
}

export default Page