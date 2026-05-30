import "./globals.css";
import { DealProvider } from "./context/DealContext";

export const metadata = {
  title: "RU-TIMBER Export | Premium Halal Russian Sawn Timber",
  description: "Premium Russian Pine, Spruce & Larch timber for halal markets. GOST 8486-86, KD 10-12%, ISPM-15. Direct from Vologda sawmills to UAE, Saudi Arabia, Qatar, Egypt.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DealProvider>
          {children}
        </DealProvider>
      </body>
    </html>
  );
}