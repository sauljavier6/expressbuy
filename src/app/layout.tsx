// 📌 src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageProvider from "@/context/languageprovider/LanguageProvider"; // Importa LanguageProvider
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { CartProvider } from "@/context/cartcontext/CartContext";
import SessionProviderWrapper from "@/components/sessionproviderwrapper/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SessionProviderWrapper>
            <Navbar />
              <CartProvider >
                <div className="pt-14">
                  {children}
                </div>
              </CartProvider>
            <Footer />
          </SessionProviderWrapper>
        </body>
      </html>
    </LanguageProvider>
  );
}
