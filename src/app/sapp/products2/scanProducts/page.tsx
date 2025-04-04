"use client";
import { useState, useRef, useEffect } from "react";
import Cart from '../components/cart';
import { useShowCart } from "../context/ShowCartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSearch } from "../context/SearchContext";

const ScanProducts = () => {
  const route = useRouter();
  const { showCart } = useShowCart();
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { searchText, setSearchText, searchResults  } = useSearch();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    setSearchText('');
    let doorStatus = localStorage.getItem('doorStatus') || '';
    if (!session?.user?.fname && doorStatus !== 'opened') {
      route.push('/sapp/dashBoard2');
    }
    openCamera();
    return () => closeCamera();
  }, []);

  return (
    <>
      <div className="h-[900px] flex flex-col items-center justify-center ">
        <video ref={videoRef} autoPlay playsInline className="w-full   border-2 border-gray-400 rounded-md"></video>
      </div>

      {showCart && <Cart />}
    </>
  );
};

export default ScanProducts;
