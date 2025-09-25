"use client";
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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function SelectMonth({
  className,
}: {
  className?: string;
}) {
  const setMonth = useCalendarStore((state) => state.setMonth);
  const month = useCalendarStore((state) => state.month);

  return (
    <Select
      defaultValue={new Date().getMonth().toString()}
      value={month.toString()}
      onValueChange={(value) => setMonth(Number(value))}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Month</SelectLabel>
          {months.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
