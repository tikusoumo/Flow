"use client";
import { StringParamProps } from "@/types/task";
import React from "react";

export default function BrowserInstanceParam({ param }: StringParamProps) {
  return <p className="text-xs text-muted-foreground">{param.name}</p>;
}
