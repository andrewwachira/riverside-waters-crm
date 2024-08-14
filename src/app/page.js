import { deroseFont, satoshi } from "./layout";
import { Montserra } from "./fonts/";
import Link from "next/link";
import bg1 from "../../public/images/pattern2.png"
import bg2 from "../../public/images/riverside-brand.jpg";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className=" min-h-screen grid grid-cols-1 md:grid-cols-2 justify-between">
        <section className="gradient-home ">
          <div style={{backgroundImage:`url(${bg1.src})`, backgroundSize:"cover"}} className="flex flex-col h-screen items-center justify-around">
            <h1 className={`text-5xl text-white text-center mt-10 flex justify-around ${satoshi.className} tracking-[0.3em]`}>Riverside  Water</h1>
            <p className={`text-white text-2xl  my-10 text-center ${Montserra.className}`}>A Client Management System</p>
            <Link href={session?.user?.name ? "/dashboard": "/accounts/signIn"} className="bg-white px-10 py-5 shadow-lg rounded-md text-black">Jump In</Link>
          </div>
        </section>
        <div style={{backgroundImage:`url(${bg2.src})`, backgroundSize:"cover"}}></div>
    </main>
  );
}
