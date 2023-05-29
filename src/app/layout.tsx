import "./globals.css";
import AuthContext from "../context/AuthContext";
import ToasterContext from "../context/ToasterContext";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Politai-social",
  description: "A social app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthContext>
          <Providers>{children}</Providers>
        </AuthContext>
      </body>
    </html>
  );
}
