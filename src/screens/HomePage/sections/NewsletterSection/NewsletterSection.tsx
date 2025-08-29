import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

export const NewsletterSection = (): JSX.Element => {
  return (
    <section className="w-full py-14 bg-secondary-color">
      <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <h2 className="font-['Montserrat',Helvetica] font-medium text-white text-4xl">
            Subscribe to our Newsletter
          </h2>
          <p className="font-['Open_Sans',Helvetica] font-normal text-white/90 text-2xl">
            Receive our weekly newsletter &amp; updates with new events from
            your favourite organizers &amp; venues.
          </p>
        </div>

        <div className="w-full lg:w-auto flex-1 lg:max-w-[706px]">
          <div className="flex h-20 rounded-[10px] overflow-hidden border border-solid border-white/20">
            <Input
              className="flex-1 h-full px-7 text-xl font-['Open_Sans',Helvetica] border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Enter your e-mail address"
              type="email"
            />
            <Button className="w-[184px] h-full rounded-none bg-text-black hover:bg-text-black/90 font-['Open_Sans',Helvetica] font-bold text-white text-2xl">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
