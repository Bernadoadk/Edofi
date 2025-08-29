import React from "react";
import { BestOfEventsSection } from "./sections/BestOfEventsSection/BestOfEventsSection";
import { CategoriesSection } from "./sections/CategoriesSection";
import { CreateEventSection } from "./sections/CreateEventSection";
import { HeroSection } from "./sections/HeroSection";
import { NewsletterSection } from "./sections/NewsletterSection";
import { PersonalizedEventsSection } from "./sections/PersonalizedEventsSection";
import { PopularEventsSection } from "./sections/PopularEventsSection/PopularEventsSection";
import { TrendingEventsSection } from "./sections/TrendingEventsSection";
import { Layout } from "../../components/Layout";
import { NotificationTest } from "../../components/NotificationTest";

export const HomePage = (): JSX.Element => {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <PopularEventsSection />
      <BestOfEventsSection />
      <PersonalizedEventsSection />
      <TrendingEventsSection />
      <CreateEventSection />
      <NewsletterSection />
      
      {/* Test des notifications - À retirer en production */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto">
          <NotificationTest />
        </div>
      </div>
    </Layout>
  );
};
