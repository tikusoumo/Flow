"use client";
import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import React from "react";

export default function DeletableEdge(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%,-50%) translate(${labelX}px ,${labelY}px)`,

            pointerEvents: "all",
          }}
        >
         <Button variant={"outline"} size={"icon"} className="w-6 h-6 cursor-pointer hover:shadow-lg rounded-full">
          <p className=" -translate-y-[1px]">

          x
          </p>
         </Button>
          
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
