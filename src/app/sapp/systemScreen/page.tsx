'use client';

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
 
interface Props {
  children: React.ReactNode;
  isServerMobile: boolean;
}

const SystemscreenPage = ({ children, isServerMobile }: Props) => {
  const bgImage = '../../../../public/images/desktop-bg.png';
 
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [checking, setChecking] = useState(true);
  const [redirectedFrom, setRedirectedFrom] = useState<string | null>(null);

  const checkLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
          setChecking(false);
        },
        () => {
          setLocationEnabled(false);
          setChecking(false);
        }
      );
    } else {
      setLocationEnabled(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    setIsMobile(window.innerWidth <= 1024);
    setIsOnline(navigator.onLine);
    checkLocation();

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [redirectedFrom, pathname, router]);

  useEffect(() => {
    if (!checking) {
      if (!isOnline && pathname !== '/no-internet') {
        setRedirectedFrom(pathname);
        router.push('/sapp/no-internet');
      } else if (!locationEnabled && pathname !== '/no-location') {
        setRedirectedFrom(pathname);
        router.replace('/sapp/no-location');
      } else if (!isMobile && pathname !== '/systemScreen') {
        setRedirectedFrom(pathname);
        router.push('/sapp/systemScreen');
      } else if (isMobile && pathname === '/systemScreen' && redirectedFrom) {
        router.replace(redirectedFrom);
        setRedirectedFrom(null);
      }
    }
  }, [isMobile, isOnline, locationEnabled, checking,pathname,redirectedFrom,router]);

  // 🌟 Optional fallback if server already knows it's desktop
  if (!isServerMobile && pathname === '/') {
    return (
      <div
        className="w-full h-[100dvh] flex justify-center items-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "contain",
        }}
      >
        <h1 className="text-white text-center text-lg px-4">
          Please Login using a Mobile Device to get access to our App
        </h1>
      </div>
    );
  }

  return <>{children}</>;
};

export default SystemscreenPage;
