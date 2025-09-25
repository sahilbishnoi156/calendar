"use client";
import React from "react";
import { useCalendarStore } from "@/store/calenderStore";
import { TextAlignJustify } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const country = useCalendarStore((state) => state.country);
  const toggleSheet = useCalendarStore((state) => state.toggleSheet);

  return (
    <div className="flex items-center justify-between p-4 py-2 ">
      <div className="flex items-center gap-3 ">
        <Image src="/website_logo.webp" alt="Logo" width={35} height={35} />
        <span className="text-xl font-semibold">Calendar</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-yellow-600"></div>
          {country.Name}
        </div>
        <button
          onClick={toggleSheet}
          className="p-3 rounded-full hover:bg-gray-200 cursor-pointer"
        >
          <TextAlignJustify size={23} />
        </button>
      </div>
    </div>
  );
}
