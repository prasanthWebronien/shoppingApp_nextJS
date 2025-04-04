"use client";

import { useEffect, useState } from "react";
import bgImage from '../../../../public/images/desktop-bg.png';

export default function DeviceGuard({ children }: { children: React.ReactNode }) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width <= 1024) {
        setIsMobileOrTablet(true); // mobile or tablet
      } else {
        setIsMobileOrTablet(false); // desktop or large screen
      }
    };

    checkDevice(); // initial check
    window.addEventListener("resize", checkDevice); // update on resize
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobileOrTablet === null) return null; // optional: loading or nothing

  if (!isMobileOrTablet) {
    return (
      <div
      className="w-full h-[100dvh] flex justify-center items-center"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-white">Please Login using an Mobile Device to get access to our App</h1>
    </div>
    );
  }

  return <>{children}</>;
}
