import React from "react";
import Header from "@/components/header";
import CollapsableSheet from "@/components/collapsableSheet";
import CalendarView from "@/components/calendarView";

export default function Page() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f8fafd]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <CalendarView />
        </div>
        <CollapsableSheet />
      </div>
    </div>
  );
}
