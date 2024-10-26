import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Link from 'next/link';

function SMS(){
    return(
        <DefaultLayout>
            <Breadcrumb pageName={`sms`}/>
            <div className="rounded-md border border-stroke bg-white p-5   mb-7  shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
                <h1 className='text-3xl font-bold text-center m-4 pb-4'>Choose Organisation</h1>
                <Link href='/dashboard/sms/rsd' className='rounded-md bg-blue-600 px-4 py-2 mb-4 hover:opacity-90 flex items-center justify-center w-full text-white'><p className=''>Riverside Dental</p></Link>
                <div className='heading-separator'> Or</div>
                <Link href='/dashboard/sms/rsw' className='rounded-md bg-blue-600 px-4 py-2 mt-4 mb-7 hover:opacity-90 flex items-center justify-center w-full text-white'><p className=''>Riverside Water</p></Link>
            </div>
        </DefaultLayout>        
    )
}

export default SMS;