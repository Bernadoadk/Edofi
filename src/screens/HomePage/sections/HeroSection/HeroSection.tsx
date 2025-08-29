import { ChevronDownIcon, MapPinIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative w-full h-[450px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'linear-gradient(0deg, rgba(43,41,61,0.5) 0%, rgba(43,41,61,0.5) 100%), url("/src/assets/Hero.png")' }}>
      <div className="relative max-w-[830px] mx-auto pt-[179px] text-left">
        <h2 className="font-['Montserrat',Helvetica] font-bold text-assignment-1white text-2xl tracking-wide leading-tight">
          À ne pas manquer !<br />
          <span className="whitespace-nowrap">Découvrez les <span className="text-[#f2b705]">événements dynamiques</span> qui se déroulent localement et mondialement.</span>
        </h2>
      </div>

      <Card className="relative max-w-[830px] h-20 mx-auto mt-[25px] rounded-[10px] border-none shadow-none">
        <CardContent className="p-0 h-full flex">
          <div className="flex-1 h-full flex items-center pl-6 rounded-l-[10px] bg-assignment-1white">
            <SearchIcon className="w-[30px] h-8 text-gray-400" />
            <Input
              className="border-none h-full pl-6 text-xl font-normal font-['Montserrat',Helvetica] text-[#5a5a5a80] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="SearchIcon Events, Categories, Location,..."
            />
          </div>

          <div className="w-[302px] h-full flex items-center pl-6 bg-assignment-1white rounded-r-[10px] border-l border-[#5a5a5a99]">
            <div className="w-[22px] h-[30px]">
              <MapPinIcon className="w-7 h-[38px] -mt-[3px] -ml-[3px] text-assignment-1dark-grey" />
            </div>
            <span className="ml-[15px] font-['Montserrat',Helvetica] font-medium text-assignment-1dark-grey text-[22px]">
              Mumbai
            </span>
            <ChevronDownIcon className="ml-auto mr-6 w-[21px] h-[13px] text-assignment-1dark-grey" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
