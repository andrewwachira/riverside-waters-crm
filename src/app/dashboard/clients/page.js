import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import db from '@/lib/db';
import Client from '@/lib/db/models/Client';
import Link from 'next/link';

async function Clients() {
  
  await db.connect();
  const clients = await Client.find({});
  
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Clients"/>
      <div className='flex flex-row-reverse'>
         <Link href="/dashboard/forms" className='rounded-md bg-blue-600 px-4 py-2 mb-4 hover:opacity-90 flex w-fit text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 inline" width={24} height={24} color={"#fff"} fill={"none"}>
              <path d="M14 12.6483L16.3708 10.2775C16.6636 9.98469 16.81 9.83827 16.8883 9.68032C17.0372 9.3798 17.0372 9.02696 16.8883 8.72644C16.81 8.56849 16.6636 8.42207 16.3708 8.12923C16.0779 7.83638 15.9315 7.68996 15.7736 7.61169C15.473 7.46277 15.1202 7.46277 14.8197 7.61169C14.6617 7.68996 14.5153 7.83638 14.2225 8.12923L11.8517 10.5M14 12.6483L5.77754 20.8708C5.4847 21.1636 5.33827 21.31 5.18032 21.3883C4.8798 21.5372 4.52696 21.5372 4.22644 21.3883C4.06849 21.31 3.92207 21.1636 3.62923 20.8708C3.33639 20.5779 3.18996 20.4315 3.11169 20.2736C2.96277 19.973 2.96277 19.6202 3.11169 19.3197C3.18996 19.1617 3.33639 19.0153 3.62923 18.7225L11.8517 10.5M14 12.6483L11.8517 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19.5 2.5L19.3895 2.79873C19.2445 3.19044 19.172 3.38629 19.0292 3.52917C18.8863 3.67204 18.6904 3.74452 18.2987 3.88946L18 4L18.2987 4.11054C18.6904 4.25548 18.8863 4.32796 19.0292 4.47083C19.172 4.61371 19.2445 4.80956 19.3895 5.20127L19.5 5.5L19.6105 5.20127C19.7555 4.80956 19.828 4.61371 19.9708 4.47083C20.1137 4.32796 20.3096 4.25548 20.7013 4.11054L21 4L20.7013 3.88946C20.3096 3.74452 20.1137 3.67204 19.9708 3.52917C19.828 3.38629 19.7555 3.19044 19.6105 2.79873L19.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M19.5 12.5L19.3895 12.7987C19.2445 13.1904 19.172 13.3863 19.0292 13.5292C18.8863 13.672 18.6904 13.7445 18.2987 13.8895L18 14L18.2987 14.1105C18.6904 14.2555 18.8863 14.328 19.0292 14.4708C19.172 14.6137 19.2445 14.8096 19.3895 15.2013L19.5 15.5L19.6105 15.2013C19.7555 14.8096 19.828 14.6137 19.9708 14.4708C20.1137 14.328 20.3096 14.2555 20.7013 14.1105L21 14L20.7013 13.8895C20.3096 13.7445 20.1137 13.672 19.9708 13.5292C19.828 13.3863 19.7555 13.1904 19.6105 12.7987L19.5 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10.5 2.5L10.3895 2.79873C10.2445 3.19044 10.172 3.38629 10.0292 3.52917C9.88629 3.67204 9.69044 3.74452 9.29873 3.88946L9 4L9.29873 4.11054C9.69044 4.25548 9.88629 4.32796 10.0292 4.47083C10.172 4.61371 10.2445 4.80956 10.3895 5.20127L10.5 5.5L10.6105 5.20127C10.7555 4.80956 10.828 4.61371 10.9708 4.47083C11.1137 4.32796 11.3096 4.25548 11.7013 4.11054L12 4L11.7013 3.88946C11.3096 3.74452 11.1137 3.67204 10.9708 3.52917C10.828 3.38629 10.7555 3.19044 10.6105 2.79873L10.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className='mx-2 inline '>Add Client</span>
          </Link>
      </div>
     
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        All Clients
      </h4>

      {clients.length < 1 ? 
      <div className='rounded-md border border-rose-500 mb-5 w-full bg-rose-200'>
        <p className='p-5 text-center text-lg text-rose-700'>There are no clients registered yet.</p>
      </div>
      :
      <div className="flex flex-col">
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

        {clients.map((client, key) => (
          <div className={`grid grid-cols-3 sm:grid-cols-5 ${ key === clients.length - 1 ? "" : "border-b border-stroke dark:border-strokedark" }`} key={key}>
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white sm:block">
                {client.firstName + " " + client.lastName}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{client.phoneNumber}</p>
            </div>

            <div className="hidden items-center justify-center md:block p-2.5 xl:p-5">
              <p className="text-black text-center dark:text-white">{client.residence}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 md:block xl:p-5">
              <p className="text-black text-center dark:text-white">{client.contactPerson?.name}</p>
            </div>

            <div className="items-center justify-center p-2.5 sm:flex xl:p-5">
              <Link href={`/dashboard/clients/${client._id}/`} className="text-meta-5 underline">More Details</Link>
            </div>
          </div>
        ))}
      </div>
      }
    </div>
    <div className='h-[50vh]'></div>
    </DefaultLayout>
  )
}

export default Clients