// components/NavBarSkeleton.tsx
"use client";
import React from "react";

const NavBarSkeleton = () => {
  return (
    <div>
      <div className="backdrop-blur-md border-b shadow-lg sticky top-0 z-50 bg-white/97">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="animate-pulse">
                <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              <div className="animate-pulse flex space-x-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-9 w-20 bg-gray-200 rounded-md"
                  ></div>
                ))}
                <div className="h-9 w-24 bg-gray-200 rounded-md ml-4"></div>
                <div className="h-9 w-24 bg-blue-200 rounded-md"></div>
              </div>
            </div>

            <div className="flex items-center lg:hidden">
              <div className="animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarSkeleton;