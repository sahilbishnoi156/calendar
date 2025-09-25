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
import countries from "@/constants/countries.json";
import { Country } from "@/interfaces/Country";
import { useCalendarStore } from "@/store/calenderStore";

const views = ["monthly", "quarterly"];

export default function SelectCountry({
  className,
}: {
  className?: string;
}) {
  const setCountry = useCalendarStore((state) => state.setCountry);
  const setView = useCalendarStore((state) => state.setView);

  return (
    <Select
      defaultValue="IN"
      onValueChange={(value) => {
        const selectedCountry = countries.find(
          (country) => country.Code === value
        );
        if (selectedCountry) {
          setCountry(selectedCountry);
        }
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a Country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Country</SelectLabel>
          {countries.map((country: Country) => (
            <SelectItem key={country.Code} value={country.Code}>
              {country.Name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function SelectView({ className }: { className?: string }) {
  const setView = useCalendarStore((state) => state.setView);

  return (
    <Select
      defaultValue="monthly"
      onValueChange={(value) => setView(value as "monthly" | "quarterly")}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a View" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>View</SelectLabel>
          {views.map((view) => (
            <SelectItem key={view} value={view}>
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
