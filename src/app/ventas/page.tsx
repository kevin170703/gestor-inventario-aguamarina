import { User4OutlinedRounded } from "@lineiconshq/react-lineicons";
import { IconCalendarMonth, IconCoin } from "@tabler/icons-react";
import React from "react";

export default function page() {
  return (
    <div className="space-y-6 overflow-hidden p-6 max-md:px-4 max-md:pt-16">
      <div className="w-full flex justify-between items-center border-b border-gray-200 pb-4 mb-10">
        <h2 className="text-2xl font-semibold text-black/80">Ventas</h2>

        <div className="flex justify-center items-center gap-3 border-l border-gray-200 pl-4 max-md:hidden">
          <div className="bg-primary rounded-full p-1.5">
            <User4OutlinedRounded className="text-white" />
          </div>

          <div>
            <p className="font-medium">Agumarina</p>

            <p className="text-[10px] text-black/70">
              aguamarinatienda@gmail.com
            </p>
          </div>

          {/* <IconChevronDown className="text-black/50 size-6" /> */}
        </div>
      </div>

      <div className="flex justify-start items-center gap-6">
        <div className="flex justify-start items-start gap-4 border-r border-gray-200 w-max pr-6">
          <div className="bg-gray-200 w-max p-1 rounded-full size-9 ">
            <IconCoin
              className="text-primary -rotate-12 size-full"
              strokeWidth={1.5}
            />
          </div>

          <div className="space-y-2">
            <p className="uppercase text-black/60 font-medium">
              Ventas totales
            </p>
            <p className="text-4xl font-medium">$100,000</p>
          </div>
        </div>

        <div className="flex justify-start items-start gap-4 border-r border-gray-200 w-max pr-6">
          <div className="bg-gray-200 w-max p-1 rounded-full size-9 ">
            <IconCalendarMonth
              className="text-green-600 -rotate-12 size-full"
              strokeWidth={1.5}
            />
          </div>

          <div className="space-y-2">
            <p className="uppercase text-black/60 font-medium">
              Ventas ultimo mes
            </p>
            <p className="text-4xl font-medium">$20,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
