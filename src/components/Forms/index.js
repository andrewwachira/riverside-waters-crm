"use client";
import FilterForm from './FilterForm';
import ClientRegistrationForm from './ClientRegistrationForm';
import TestForm from './TestForm';

function Forms() {
  return (
    <div className="">
    {/* Client Registration form ============================================================================================================================================*/}
        <ClientRegistrationForm/>
    {/* Filter form ============================================================================================================================================*/}
       <FilterForm/>
    {/* Test Form=================================================================================================================================== */}
        <TestForm/>
    <div className='h-[50vh]'></div>
</div>
  )
}

export default Forms