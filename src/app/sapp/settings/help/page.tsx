'use client';

import Image from "next/image";
import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";
import UserIcon from "../../components/icons/UserIcon";
import SearchIcon from '../../components/icons/SearchIcon';
import FAQ from './components/FAQ';
import Videos from './components/Videos';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const HelpPage = () => {
  const router = useRouter();
  const {data:session}=useSession();
  const [selectedContent, setSelectedContent] = useState<'faq' | 'videos'>('faq');

  useEffect(()=>{
 
    if (!session?.user.fname) {
      router.push('/sapp/dashBoard2');
    }
  },[])

  return (
    <div className="flex flex-col px-5 h-full w-full bg-white">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex text-buttonColor items-center justify-between relative h-1/2 py-5">
          <ArrowLeftIcon className="text-buttonColor" onClick={() => router.push(`/sapp/settings`)} />
          <h1 className="text-black font-bold text-xl">Vending Machine</h1>
          <UserIcon className="text-buttonColor w-10 h-10" onClick={() => router.push(`profile`)} />
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center justify-center gap-10">
          <div
            className={`flex gap-5 items-center cursor-pointer rounded-xl px-6 py-3 ${
              selectedContent === 'faq' ? 'bg-buttonColor text-white' : 'bg-gray-100 text-black'
            }`}
            onClick={() => setSelectedContent('faq')}
          >
            <Image src='/images/question.png' alt='FAQ' className="h-10 w-10" height={1000} width={1000} />
            <h1 className="font-bold text-2xl">FAQ</h1>
          </div>

          <div
            className={`flex gap-5 items-center cursor-pointer rounded-xl px-6 py-3 ${
              selectedContent === 'videos' ? 'bg-buttonColor text-white' : 'bg-gray-100 text-black'
            }`}
            onClick={() => setSelectedContent('videos')}
          >
            <Image src='/images/play.png' alt='Videos' className="h-10 w-10" height={1000} width={1000} />
            <h1 className="font-bold text-2xl">Videos</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => console.log('Search:', e.target.value)}
            className="w-full bg-white text-black font-semibold py-3 px-5 border-2 border-buttonColor outline-none text-left rounded-full focus:ring-2 focus:ring-buttonColor transition-all"
          />
          <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-buttonColor" />
        </div>
      </div>

      {/* 🔥 Dynamic Children Render */}
      <div className="mt-10">
        {selectedContent === 'faq' && <FAQ />}
        {selectedContent === 'videos' && <Videos />}
      </div>
    </div>
  );
};

export default HelpPage;