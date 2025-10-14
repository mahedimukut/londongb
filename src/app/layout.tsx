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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
