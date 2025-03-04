import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

//Import the new QueryProvider
import QueryProvider from "@/components/QueryProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie App",
  description: "Manage your favorite movies efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="A movie app to manage your favorite films" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-white`}>
        {/* Wrap the whole app with QueryProvider */}
        <QueryProvider>
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
          />

          {/* Layout Structure */}
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
