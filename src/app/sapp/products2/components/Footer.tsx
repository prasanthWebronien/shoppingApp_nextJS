import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useShowCart } from "../context/ShowCartContext";
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const { setShowCart } = useShowCart();
  const route = useRouter();
  const [images, setImages] = useState([
    '/images/VM.png',
    '/images/fridge.png',
    '/images/noBarcode.png',
    '/images/shopping-basket.png'
  ]);

  useEffect(() => {
    const subFolder = pathname.split('/sapp/products2/')[1];

    if (subFolder === 'FridgeProducts') {
      setImages([
        '/images/barcode-scan.png',
        '/images/VM.png',
        '/images/noBarcode.png',
        '/images/shopping-basket.png'
      ]);
    } else if (subFolder === 'vmProducts') {
      setImages([
        '/images/barcode-scan.png',
        '/images/fridge.png',
        '/images/noBarcode.png',
        '/images/shopping-basket.png'
      ]);
    } else if (subFolder === 'noBarcodeProducts') {
      setImages([
        '/images/barcode-scan.png',
        '/images/VM.png',
        '/images/fridge.png',
        '/images/shopping-basket.png'
      ]);
    } else {
      setImages([
        '/images/VM.png',
        '/images/fridge.png',
        '/images/noBarcode.png',
        '/images/shopping-basket.png'
      ]);
    }
  }, [pathname]);



  const handleBottomMenuClick = (text: string) => {
    console.log(text);
    if (text == '/images/VM.png') {
      route.push('vmProducts');
    } else if (text == '/images/fridge.png') {
      route.push('FridgeProducts');
    } else if (text == '/images/noBarcode.png') {
      route.push('noBarcodeProducts');
    } else {
      route.push('scanProducts');
    }
  }

  return (
    <footer className="bg-white p-4 text-white">
      <div className="flex justify-center items-center gap-3 py-4 bg-buttonColor rounded-full w-full ">
        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center" onClick={() => handleBottomMenuClick(images[0])}>
          <Image src={images[0]} alt='image' className="object-contain rounded-full w-16 h-16 bg-white" width={1000} height={1000} />
        </div>

        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center" onClick={() => handleBottomMenuClick(images[1])}>
          <Image
            src={images[1]}
            alt=''
            className="rounded-full h-20 w-12 object-contain object-contain"
            width={1000}
            height={1000}
          />
        </div>

        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center" onClick={() => handleBottomMenuClick(images[2])}>
          <Image src={images[2]} alt='imaage' className="rounded-full w-16 h-16 bg-white object-contain" width={1000} height={1000} />
        </div>

        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center"
          onClick={() => setShowCart(true)}>
          <Image src={images[3]} alt='image' className="rounded-full w-16 h-16 bg-white object-contain" width={1000} height={1000} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
