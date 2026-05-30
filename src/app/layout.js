import "./globals.css";
import { DealProvider } from "./context/DealContext";
import { Playfair_Display, Inter, Amiri } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata = {
  title: "RU-TIMBER Export | Premium Halal Russian Sawn Timber",
  description: "Premium Russian Pine, Spruce & Larch timber for halal markets. GOST 8486-86, KD 10-12%, ISPM-15. Direct from Vologda sawmills to UAE, Saudi Arabia, Qatar, Egypt.",
  keywords: "halal timber, russian pine, redwood, GOST 8486, UAE timber import, Jebel Ali, sawn timber export",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${amiri.variable}`}>
      <body className="font-sans">
        <DealProvider>
          {children}
        </DealProvider>
      </body>
    </html>
  );
}