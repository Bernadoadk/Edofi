import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const CategoriesSection = (): JSX.Element => {
  // Create an array of category data to map over
  const categories = [
    { id: 1, name: "Concerts & Musique" },
    { id: 2, name: "Festivals & Culture" },
    { id: 3, name: "Business & Networking" },
    { id: 4, name: "Sport & Loisirs" },
    { id: 5, name: "Art & Spectacles" },
    { id: 6, name: "Gastronomie" },
  ];

  return (
    <section className="w-full flex flex-col items-center justify-center py-8">
      <h2 className="font-['Montserrat',Helvetica] font-bold text-assignment-1dark-bluish-grey text-[40px]">
        Explore Categories
      </h2>
      <div className="flex items-start gap-10 overflow-x-auto">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="border-none shadow-none bg-transparent"
          >
            <CardContent className="flex flex-col items-center gap-[30px] p-0">
              <div className="w-[170px] h-[170px] bg-[#d9d9d9] rounded-[120px]" />
              <h3 className="w-[236px] font-assignment-1-small-title font-[number:var(--assignment-1-small-title-font-weight)] text-assignment-1dark-bluish-grey text-[length:var(--assignment-1-small-title-font-size)] text-center tracking-[var(--assignment-1-small-title-letter-spacing)] leading-[var(--assignment-1-small-title-line-height)] [font-style:var(--assignment-1-small-title-font-style)]">
                {category.name}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
