import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "BritCartBD – Your Trusted Online Marketplace",
  description:
    "Shop online in Bangladesh with BritCartBD. From skincare and health to baby products, electronics, auto parts, pet supplies, and more — everything you need in one trusted marketplace.",
  icons: {
    icon: [
      {
        url: "/images/favicon/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/images/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
      </head>
      <body className={`${nunitoSans.variable} font-sans antialiased`}>
        <SessionProvider>
          <CartProvider>
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
