"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StringParamProps } from "@/types/task";
import React, { useId } from "react";

type Optiontype = {
  label: string;
  value: string;
};

export default function SelectParam({ param, updateNodeParamValue,value }: StringParamProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full px-2">
      <Label htmlFor={id} className="text-xs  flex">
        {param.name}
        {param.required && <span className="text-red-500 text-xs ml-1">*</span>}
      </Label>
      <Select onValueChange={(value) => updateNodeParamValue(value)}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select an option " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((option: Optiontype) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
