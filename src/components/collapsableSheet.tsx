"use client"
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendarStore } from "@/store/calenderStore";
import SelectCountry from "./selectCountry";
import SelectYear from "./selectYear";
import SelectMonth from "./selectMonth";
import { SelectView } from "./selectView";

export default function CollapsableSheet() {
  const { isSheetOpen } = useCalendarStore();

  return (
    <div
      className={`${isSheetOpen ? "p-4" : "p-0"} transition-all duration-300 ease-in-out sticky top-0 right-0 ${
        isSheetOpen ? "translate-x-0 sm:w-1/5 w-full" : "translate-x-full w-0"
      }`}
    >
      <div className="mb-4">
        <label className="block mb-2">Country</label>
        <SelectCountry className="w-full bg-white border-none" />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Year</label>
        <SelectYear className="w-full bg-white border-none" />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Month</label>
        <SelectMonth className="w-full bg-white border-none" />
      </div>
      <div className="mb-4">
        <label className="block mb-2">View</label>
        <SelectView className="w-full bg-white border-none" />
      </div>
      
    </div>
  );
}
