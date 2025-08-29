import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const BestOfEventsSection = (): JSX.Element => {
  return (
    <section className="w-full py-16 px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meilleurs événements
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
