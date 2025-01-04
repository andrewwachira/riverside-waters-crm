import React from 'react'
import FilterByYear from '@/components/Layouts/FilterByYear'
import { getClients3 } from '@/actions/server';

async function Page() {

  const {clients,year} = await getClients3(2022);
  return (
    <div>
        <FilterByYear clients={clients} year={year}/>
    </div>
  )
}

export default Page