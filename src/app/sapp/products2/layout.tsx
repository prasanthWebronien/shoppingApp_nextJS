"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { ShowCartProvider } from "./context/ShowCartContext"; // Import the context

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <ShowCartProvider>
      <div className="relative h-screen w-full flex flex-col">
        <div className="fixed top-0 left-0 w-full z-50">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto mt-20 mb-16 px-4">
          {children}
        </main>

        <div className="fixed bottom-0 left-0 w-full z-40">
          <Footer />
        </div>
      </div>
    </ShowCartProvider>
  );
};

export default LayoutPage;
