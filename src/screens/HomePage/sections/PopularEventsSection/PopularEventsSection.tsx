import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const PopularEventsSection = (): JSX.Element => {
  // Event filter options
  const filterOptions = ["All", "Today", "Tomorrow", "This Weekend", "Free"];

  return (
    <section className="w-full max-w-[1618px] mx-auto py-16">
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Événements populaires
          </h2>
          <p className="text-gray-600 mb-8">
            Créez votre premier événement pour le voir apparaître ici !
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Créer un événement
          </Button>
        </div>
      </div>
    </section>
  );
};
