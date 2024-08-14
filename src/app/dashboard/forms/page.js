import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Forms from '@/components/Forms'

async function Form() {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Forms"></Breadcrumb>
      <Forms></Forms>
    </DefaultLayout>
  )
}

export default Form