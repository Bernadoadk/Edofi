import React from "react";
import { Separator } from "../../../../components/ui/separator";

export const FooterSection = (): JSX.Element => {
  // Company Info links data
  const companyInfoLinks = [
    "About Us",
    "Contact Us",
    "Careers",
    "FAQs",
    "Terms of Service",
    "Privacy Policy",
  ];

  // Help links data
  const helpLinks = [
    "Account Support",
    "Listing Events",
    "Event Ticketing",
    "Ticket Purchase Terms & Conditions",
  ];

  // Categories links data
  const categoriesLinks = [
    "Concerts & Gigs",
    "Festivals & Lifestyle",
    "Business & Networking",
    "Food & Drinks",
    "Performing Arts",
    "Sports & Outdoors",
    "Exhibitions",
    "Workshops, Conferences & Classes",
  ];

  // Social media links data
  const socialLinks = ["Facebook", "Instagram", "Twitter", "Youtube"];

  return (
    <footer className="w-full bg-assignment-1dark-navy-blue py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img
            src="/src/assets/Fiwè.png"
            alt="Fiwè Logo"
            className="h-16 w-auto"
          />
        </div>
        
        <div className="flex flex-wrap justify-between gap-8">
          {/* Company Info Column */}
          <div className="flex flex-col items-start gap-6">
            <h3 className="font-['Montserrat',Helvetica] font-semibold text-assignment-1white text-2xl">
              Company Info
            </h3>
            <div className="flex flex-col items-start gap-2">
              {companyInfoLinks.map((link, index) => (
                <a
                  key={`company-${index}`}
                  href="#"
                  className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-lg hover:text-assignment-1white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Help Column */}
          <div className="flex flex-col items-start gap-6">
            <h3 className="font-['Montserrat',Helvetica] font-semibold text-assignment-1white text-2xl">
              Help
            </h3>
            <div className="flex flex-col items-start gap-2">
              {helpLinks.map((link, index) => (
                <a
                  key={`help-${index}`}
                  href="#"
                  className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-lg hover:text-assignment-1white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Categories Column */}
          <div className="flex flex-col items-start gap-6">
            <h3 className="font-['Montserrat',Helvetica] font-semibold text-assignment-1white text-2xl">
              Categories
            </h3>
            <div className="flex flex-col items-start gap-2">
              {categoriesLinks.map((link, index) => (
                <a
                  key={`category-${index}`}
                  href="#"
                  className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-lg hover:text-assignment-1white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Follow Us Column */}
          <div className="flex flex-col items-start gap-6">
            <h3 className="font-['Montserrat',Helvetica] font-semibold text-assignment-1white text-2xl">
              Follow Us
            </h3>
            <div className="flex flex-col items-start gap-2">
              {socialLinks.map((link, index) => (
                <a
                  key={`social-${index}`}
                  href="#"
                  className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-lg hover:text-assignment-1white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Download The App Column */}
          <div className="flex flex-col items-start gap-6">
            <h3 className="font-['Montserrat',Helvetica] font-semibold text-assignment-1white text-2xl">
              Download The App
            </h3>
            <div className="flex flex-col items-start gap-5">
              <div className="flex items-center gap-5 px-3.5 py-3 rounded-md border border-solid border-[#a8a8a8] hover:border-assignment-1white transition-colors cursor-pointer">
                <img
                  className="w-12 h-12 object-cover"
                  alt="Google play"
                  src="/icons8-google-play-48-1.png"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-lg">
                    Get it on
                  </span>
                  <span className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-xl">
                    Google Play
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-5 px-3.5 py-3 rounded-md border border-solid border-[#a8a8a8] hover:border-assignment-1white transition-colors cursor-pointer">
                <img
                  className="w-[50px] h-[50px] object-cover"
                  alt="Apple"
                  src="/icons8-apple-50--1--1.png"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-lg">
                    Download on the
                  </span>
                  <span className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-xl">
                    App Store
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl mt-16">
        <Separator className="bg-[#a8a8a8] opacity-50" />

        <div className="flex items-center justify-center gap-0.5 mt-4">
          <div className="relative w-[17px] h-[17px] rounded-[8.5px] border border-solid border-[#a8a8a8]">
            <img
              className="absolute w-2 h-[9px] top-0.5 left-[3px]"
              alt="Copyright symbol"
              src="/ellipse-6.svg"
            />
          </div>
          <span className="font-['Open_Sans',Helvetica] font-normal text-[#a8a8a8] text-lg">
            2023 Fiwè. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
