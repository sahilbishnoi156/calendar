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

export default function SelectCountry({
  className,
}: {
  className?: string;
}) {
  const setCountry = useCalendarStore((state) => state.setCountry);

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
