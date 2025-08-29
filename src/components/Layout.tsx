import React from "react";
import { HeaderSection } from "../screens/HomePage/sections/HeaderSection/HeaderSection";
import { FooterSection } from "../screens/HomePage/sections/FooterSection/FooterSection";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div className="bg-white flex flex-col items-center w-full min-h-screen">
      <div className="bg-assignment-1white w-full max-w-[1920px] relative flex flex-col min-h-screen">
        <HeaderSection />
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <FooterSection />}
      </div>
    </div>
  );
};
