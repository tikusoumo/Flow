import { ExecutionPhaseStatus } from "@/types/workflow";
import { CircleCheck, CircleDashedIcon, CircleXIcon, Loader2Icon } from "lucide-react";

export default function PhaseStatusBadge({
  status,
}: {
  status: ExecutionPhaseStatus;
}) {
   switch(status) {
    
     case ExecutionPhaseStatus.PENDING:
       return <CircleDashedIcon className="w-4 h-4 stroke-muted-foreground" />;
     case ExecutionPhaseStatus.RUNNING:
        return <Loader2Icon className="w-4 h-4 animate-spin stroke-yellow-500" />;
     case ExecutionPhaseStatus.FAILED:
            return <CircleXIcon className="w-4 h-4 stroke-destructive" />;
     case ExecutionPhaseStatus.COMPLETED:
            return <CircleCheck className="w-4 h-4 stroke-green-500" />;
      default:
        return <div className="rounded-full">{status}</div>  
   }
}
