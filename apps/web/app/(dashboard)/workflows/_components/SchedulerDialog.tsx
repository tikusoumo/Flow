"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function SchedulerDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"} className="flex items-center gap-2">
                    <TriangleAlertIcon className="h-3 w-3 mr-1"  />Set schedule
                </Button>
            </DialogTrigger>
          
        </Dialog>
    )
}