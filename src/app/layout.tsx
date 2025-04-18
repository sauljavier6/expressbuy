// 📌 src/app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";



import "./globals.css";
import LanguageProvider from "@/context/languageprovider/LanguageProvider"; // Importa LanguageProvider
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { CartProvider } from "@/context/cartcontext/CartContext";
import SessionProviderWrapper from "@/components/sessionproviderwrapper/SessionProviderWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <html lang="en">
      <head>
          <title> CinederellaHeels</title>
          <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
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
