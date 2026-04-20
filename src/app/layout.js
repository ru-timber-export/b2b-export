import "./globals.css";
import { DealProvider } from "./context/DealContext";

export const metadata = {
  title: "RU-TIMBER Export | Premium Russian Sawn Timber",
  description: "Russian sawn timber export to India, UAE, China. Pine, Spruce, Larch. FOB/CIF delivery. Direct from mill.",
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