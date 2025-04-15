"use client"

import { useEffect, useState } from "react"
import  CountUp  from "react-countup"

export default function ReactCountupWrapper({value}: {value: number}) {

    const [mounted, setMounted] = useState(false)

    useEffect(()=>{
        setMounted(true)
    },[])
    if(!mounted) {
        return "-"
    }

  return <CountUp preserveValue end={value} decimals={0} duration={2} />
}