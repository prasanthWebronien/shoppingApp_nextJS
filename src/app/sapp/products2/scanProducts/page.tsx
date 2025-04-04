"use client";
import { useState, useRef, useEffect } from "react";
import Cart from '../components/cart';
import { useShowCart } from "../context/ShowCartContext";


const ScanProducts = () => {
  const { showCart } = useShowCart();
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
    openCamera(); // Open camera when component mounts
    return () => closeCamera(); // Cleanup when unmounting
  }, []);

  return (
    <>
      <div className="h-full flex flex-col items-center justify-center h-screen p-4 bg-gray-100 z-[100]">
        <video ref={videoRef} autoPlay playsInline className="w-full h- border-2 border-gray-400 rounded-md"></video>
      </div>
      
      {showCart && <Cart />}
    </>
  );
};

export default ScanProducts;
