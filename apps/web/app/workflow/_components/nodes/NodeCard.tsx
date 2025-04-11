"use client";

import useFlowValidation from "@/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";


export default function NodeCard({
  children,
  nodeId,
  isSelected,
}: {
  children: React.ReactNode;
  nodeId: string;
  isSelected: boolean;
}) {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some((input) => input.nodeId === nodeId);
  
 
  const handleDoubleClick = () => {
   
    
    console.log("Double click detected on node:", nodeId);
    
    const node = getNode(nodeId);
    if (!node) {
      console.log("Node not found:", nodeId);
      return;
    }

    const { position,measured } = node;
    if (!position || !measured) {
      console.log("Position not found for node:", nodeId);
      return;
    }
    const { width, height } = measured;

    const x = position.x + width! / 2;
    const y = position.y + height! / 2;
  
    
    setCenter(x, y, {
      zoom: 1,
      duration: 500,
    });
  
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
       // Also prevent single clicks from bubbling
      className={cn(
        "w-[420px] rounded-md flex flex-col gap-1 text-xs border-2 border-separate bg-background cursor-pointer",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2 ",
      )}
    >
      {children}
    </div>
  );
}