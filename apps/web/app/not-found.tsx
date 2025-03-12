import Image from 'next/image'
import React from 'react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
       <Image
        src={"/NotFound.jpg"}
        alt="404 Not Found"
        width={500}
        height={500}
       
       />
    </div>
  )
}
