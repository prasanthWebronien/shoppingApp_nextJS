"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { ShowCartProvider } from "./context/ShowCartContext";
import { SearchProvider } from "./context/SearchContext"; // 👈 import it

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <ShowCartProvider>
      <SearchProvider>
        <div className="relative h-screen w-full flex flex-col font-poppins">
          <div className="fixed top-0 left-0 w-full z-50">
            <Header />
          </div>

          <main className="flex-1 overflow-y-auto mt-20 mb-16 px-4 font-poppins">
            {children}
          </main>

          <div className="fixed bottom-0 left-0 w-full z-40 font-poppins">
            <Footer />
          </div>
        </div>
      </SearchProvider>
    </ShowCartProvider>
  );
};

export default LayoutPage;
