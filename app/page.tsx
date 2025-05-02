"use client"
import dynamic from "next/dynamic";

const Pixelation = dynamic(
   () => import("./components/Pixelation"),
   { ssr: false }
)

export default function Home() {

   return (
      <div className="w-screen h-screen relative flex items-center justify-center">
         <Pixelation />
      </div >
   );
}
