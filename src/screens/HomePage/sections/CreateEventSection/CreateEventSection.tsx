import { CalendarPlusIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";

export const CreateEventSection = (): JSX.Element => {
  return (
    <section className="w-full py-16 bg-primary-color">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-4 max-w-3xl">
          <h2 className="font-['Montserrat',Helvetica] font-medium text-text-black text-4xl">
            Create an event with Fiwè
          </h2>
          <p className="font-['Open_Sans',Helvetica] font-normal text-text-black text-[28px] leading-[38px]">
            Got a show, event, activity or a great experience? Partner with us
            &amp; get listed on Fiwè
          </p>
        </div>

        <Button className="bg-secondary-color hover:bg-secondary-color/90 text-white rounded-[10px] px-[38px] py-[18px] h-auto mt-6 md:mt-0">
          <CalendarPlusIcon className="w-11 h-11 mr-2" />
          <span className="font-assignment-1-medium-title text-[length:var(--assignment-1-medium-title-font-size)]">
            Create Event
          </span>
        </Button>
      </div>
    </section>
  );
};
