import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";
import { useAuth } from "../../../../contexts/AuthContext";
import { UserMenu } from "../../../../components/UserMenu";
import { NotificationIcon } from "../../../../components/NotificationIcon";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

export const HeaderSection = (): JSX.Element => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Navigation items data with dynamic active state
  const navItems = [
    { name: "Home", path: "/", active: location.pathname === "/" },
    { name: "Events", path: "/events", active: location.pathname === "/events" },
    { name: "Map", path: "/map", active: location.pathname === "/map" },
    { name: "About", path: "/about", active: location.pathname === "/about" },
    { name: "Contact", path: "/contact", active: location.pathname === "/contact" },
  ];

  return (
    <header className="w-full h-[85px] bg-assignment-1dark-navy-blue flex items-center justify-between px-[100px] shadow-lg">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/src/assets/Fiwè.png"
          alt="Fiwè Logo"
          className="h-20 w-50"
        />
      </div>

      {/* Navigation */}
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="flex gap-7">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuLink asChild>
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center h-[85px] px-4 [font-family:'Montserrat',Helvetica] text-2xl text-assignment-1white relative`}
                >
                  <motion.span
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: item.active ? 360 : 0 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-block ${
                      item.active ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {item.name}
                  </motion.span>

                  {/* Barre dégradée animée */}
                  <div
                    className={`w-full h-1.5 mt-[10px] bg-gradient-to-r from-[#dfe0c5] via-[#04b1d9] to-[#f24638] rounded-full transition-all duration-500 ease-in-out ${
                      item.active
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0"
                    }`}
                  ></div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Link to="/create-event">
          <Button
            variant="ghost"
            className="[font-family:'Montserrat',Helvetica] font-medium text-assignment-1white text-2xl"
          >
            Create Event
          </Button>
        </Link>

        {loading ? (
          // Show loading spinner while checking auth status
          <LoadingSpinner size="sm" className="text-assignment-1white" />
        ) : isAuthenticated ? (
          // User is logged in - show notification icon and user menu
          <>
            <NotificationIcon notificationCount={3} />
            {user && <UserMenu user={user} />}
          </>
        ) : (
          // User is not logged in - show login/signup buttons
          <>
            <a href="/signin">
              <Button
                variant="ghost"
                className="[font-family:'Montserrat',Helvetica] font-medium text-assignment-1white text-2xl"
              >
                Login
              </Button>
            </a>
            <a href="/signup">
              <Button className="[font-family:'Montserrat',Helvetica] font-medium text-assignment-1dark-navy-blue text-2xl bg-assignment-1yellow rounded-[10px] hover:bg-assignment-1yellow/90">
                Sign Up
              </Button>
            </a>
          </>
        )}
      </div>
    </header>
  );
};
