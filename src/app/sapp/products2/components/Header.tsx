'use client'

import React, { useEffect, useState } from 'react';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import { useRouter } from 'next/navigation';
import { useSearch } from "../context/SearchContext";

const Header = () => {
  const [headerText, setHeaderText] = useState<string>('');
  const router = useRouter();

  const { searchText, setSearchText, setSearchResults } = useSearch();

  useEffect(() => {
    const path = window.location.pathname;
    const subFolder = path.split('/sapp/products2/')[1];
    let dynamicText = '';

    switch (subFolder) {
      case 'vmProducts':
        dynamicText = 'Varuautomat';
        break;
      case 'noBarcodeProducts':
        dynamicText = 'Varor utan streckkod';
        break;
      default:
        dynamicText = 'Smart-Kl';
    }

    setHeaderText(dynamicText);
  }, []);

  const handleSearchChange = async (searchText: string) => {
    setSearchText(searchText);

    // Example API call
    if (searchText.trim() !== "") {
      try {
        const res = await fetch(`/api/search?query=${searchText}`);
        const data = await res.json();
        setSearchResults(data); // Store response data in context
      } catch (err) {
        console.error("Search API Error:", err);
        setSearchResults([]); // Clear results on error
      }
    } else {
      setSearchResults([]); // Clear results if input is empty
    }
  };

  return (
    <header className="bg-white text-white px-5 font-poppins">
      <div className="flex items-center justify-center w-full relative py-8">
        <ArrowLeftIcon
          className="text-buttonColor w-9 h-9 absolute left-3"
          onClick={() => router.push('/sapp/dashBoard2')}
        />
        <strong className="text-black ml-10 text-2xl font-semibold">{headerText}</strong>
      </div>

      <div className="relative w-full">
        <SearchIcon className="text-buttonColor w-6 h-6 absolute right-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search here..."
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="rounded-full px-1 pl-5 py-3 border border-yellow-500 w-full text-black"
        />
      </div>
    </header>
  );
};

export default Header;
