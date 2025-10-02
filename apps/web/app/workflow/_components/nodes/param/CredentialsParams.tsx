"use client";
import { GetCredentialsForUser } from "@/actions/credentials/GetCredentialsForUser";
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
import { useQuery } from "@tanstack/react-query";
import React, { useId } from "react";

export default function CredentialsParam({ param, value, updateNodeParamValue }: StringParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials for user"],
    queryFn: GetCredentialsForUser,
    refetchInterval: 10000
  });

  // Don't render the Select until credentials are loaded
  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-1 w-full px-2">
        <Label htmlFor={id} className="text-sm flex">
          {param.name}
          {param.required && <span className="text-red-500 text-xs ml-1">*</span>}
        </Label>
        <div className="w-full h-9 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full px-2">
      <Label htmlFor={id} className="text-sm flex">
        {param.name}
        {param.required && <span className="text-red-500 text-xs ml-1">*</span>}
      </Label>
      <Select 
        value={value || ""} // This should work now
        onValueChange={(selectedValue) => updateNodeParamValue(selectedValue)}
      >
        <SelectTrigger className="w-full bg-white dark:bg-gray-800 dark:border-gray-600">
          <SelectValue placeholder="Select an option " />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
          <SelectGroup>
            <SelectLabel className="dark:text-gray-200">Credentials</SelectLabel>
            {query.data?.map((credential: { id: string; name: string }) => (
              <SelectItem 
              key={credential.id} 
              value={credential.id}
              className="dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
              >
              {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
