"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StringParamProps } from "@/types/task";
import { useId, useState } from "react";

export default function StringParam({
  param,
  value,
  updateNodeParamValue,
}: StringParamProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);
  return (
    <div className="space-y-2 p-2 w-full">
      <Label className="text-xs flex" htmlFor={id}>
        {param.name}
        {param.required && <p className="text-red-500">*</p>}
      </Label>
      <Input
        id={id}
        className="w-full bg-white"
        placeholder="Enter a string"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => {
          updateNodeParamValue(e.target.value);
        }}
      />
      {param.helperText && (
        <p className="text-xs text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  );
}
