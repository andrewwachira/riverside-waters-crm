import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

function RSD() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="sms" additonalRoute="dental"></Breadcrumb>
            <div className="rounded-md border border-stroke bg-white p-5   mb-7  shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
            </div>
        </DefaultLayout>
    )
}

export default RSD