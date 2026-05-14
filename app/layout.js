import "./globals.css";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "GlowCare",
  description: "Your premium skincare destination",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{ className: "customToast" }}
        />
      </body>
    </html>
  );
}
