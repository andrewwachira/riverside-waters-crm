import Link from "next/link"
const Breadcrumb = ({ pageName,additonalRoute }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {additonalRoute ? <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName} / {additonalRoute} 
      </h2> : <h2 className="text-title-md2 font-semibold text-black dark:text-white">{pageName}</h2> }

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/dashboard">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary"><Link href={`/dashboard/${pageName}`}>{pageName} </Link></li>
          { additonalRoute  && <li className="font-medium text-primary">/ {additonalRoute}</li>}
        </ol>
      </nav>
    </div>
  )
}

export default Breadcrumb

