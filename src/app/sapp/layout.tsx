// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "../../app/globals.css";
// import { getServerSession } from 'next-auth';
// import { authOptions } from './api/auth/[...nextauth]/route';

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {

//   return (
//     <html lang="en">
//       <body className={''}>
//         {children}
//       </body>
//     </html>
//   );
// }


"use client";

import { getServerSession } from 'next-auth';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={`flex flex-col md:flex-row  dark:bg-[#0F0F0F]`}>
      <div>
        {children}
      </div>
    </main>
  );
}
