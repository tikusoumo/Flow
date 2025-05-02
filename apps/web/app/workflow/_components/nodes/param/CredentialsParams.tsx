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



export default function CredentialsParam({ param, updateNodeParamValue }: StringParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials for user"],
    queryFn: GetCredentialsForUser,
    refetchInterval: 10000
  })

  return (
    <div className="flex flex-col gap-1 w-full px-2">
      <Label htmlFor={id} className="text-sm  flex">
        {param.name}
        {param.required && <span className="text-red-500 text-xs ml-1">*</span>}
      </Label>
      <Select onValueChange={(value) => updateNodeParamValue(value)}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select an option " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
           {query.data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
