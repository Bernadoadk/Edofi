import { CalendarPlusIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";

export const PersonalizedEventsSection = (): JSX.Element => {
  return (
    <section className="w-full py-16 bg-primary-color">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h2 className="font-assignment-1-section-title text-text-black text-[40px] font-bold mb-6">
          Events specially curated for you!
        </h2>

        <p className="font-assignment-1-small-title text-text-black text-2xl mb-8 max-w-2xl">
          Get event suggestions tailored to your interests! Don&#39;t let your
          favorite events slip away.
        </p>

        <Button className="bg-text-black text-white hover:bg-text-black/90 px-[38px] py-[18px] h-auto rounded-[10px] flex items-center gap-2.5">
          <span className="font-assignment-1-medium-title text-[var(--assignment-1-medium-title-font-size)]">
            Get Started
          </span>
          <CalendarPlusIcon className="w-11 h-11" />
        </Button>
      </div>
    </section>
  );
};
