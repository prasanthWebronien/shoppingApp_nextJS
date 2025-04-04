'use client'

 import Header from "./components/header";
const layoutPage = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative h-screen w-full flex flex-col">
            <div className="fixed top-0 left-0 w-full z-50">
                <Header />
            </div>

            <main className="flex-1 overflow-y-auto mt-20 mb-16 px-4 mt-10">
                {children}
            </main>

            <div className="fixed bottom-0 left-0 w-full z-50">
         
            </div>
        </div>
    )
}

export default layoutPage;
