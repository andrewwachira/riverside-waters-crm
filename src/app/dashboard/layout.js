import { Suspense } from "react";
import Loading from "./loading";

export default function DashboardLayout({
    children, // will be a page or nested layout
  }) {
    return (
      <Suspense fallback={<Loading/>}>
        {children}
      </Suspense>
    )
  }