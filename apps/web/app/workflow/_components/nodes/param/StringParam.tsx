"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StringParamProps } from "@/types/task";
import { useEffect, useId, useState } from "react";

export default function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: StringParamProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  let Component: any = Input;
  if (param.variant === "textarea") {
    Component = Textarea;
  }

  return (
    <div className="space-y-2 p-2 w-full">
      <Label className="text-xs flex" htmlFor={id}>
        {param.name}
        {param.required && <p className="text-red-500">*</p>}
      </Label>
      <Component
        id={id}
        disabled={disabled}
        className="w-full bg-white"
        placeholder="Enter a string"
        value={internalValue}
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => {
          updateNodeParamValue(e.target.value);
        }}
      />
      {param.helperText && (
        <p className="text-xs text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  );
}
