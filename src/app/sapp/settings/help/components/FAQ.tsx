'use client'

import { useState } from 'react';
import ArrowRightCircleIcon from '../../icons/ArrowRightCircleIcon';

const FAQ = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 bg-white">
      <div className="flex items-center justify-center gap-4 my-6">
        <div className="flex-grow border-t border-gray-300 max-w-[300px]"></div>
        <h1 className="text font-bold text-center text-black">FREQUENTLY ASKED QUESTIONS</h1>
        <div className="flex-grow border-t border-gray-300 max-w-[300px]"></div>
      </div>

      <div>
        <div className='flex flex-col gap-5 ' onClick={() => setIsOpen((prev) => !prev)}>
          <div className='flex items-end justify-between py-10 border-b border-gray-300 text-black'>
            <strong className="font-bold text-xl">Getting started with 24SJU</strong>
            <ArrowRightCircleIcon className="text-buttonColor w-7 h-7" />
          </div>

          {isOpen && (
            <p className='text-black'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          )}

        </div>

        <div className='flex items-end justify-between py-10 border-b border-gray-300 text-black'>
          <strong className="font-bold text-xl">Price update</strong>
          <ArrowRightCircleIcon className="text-buttonColor w-7 h-7" />
        </div>

        <div className='flex items-end justify-between py-10 border-b border-gray-300 text-black'>
          <strong className="font-bold text-xl">Connections issues</strong>
          <ArrowRightCircleIcon className="text-buttonColor w-7 h-7" />
        </div>
      </div>
    </div>
  );
};

export default FAQ;