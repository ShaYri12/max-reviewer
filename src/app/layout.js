import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Max Reviewer",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-chillax antialiased">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
