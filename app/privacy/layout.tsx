
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – DevHub",
  description: "Learn how DevHub protects your data and respects your privacy.",
  robots: { index: false, follow: false }, // Optional: don't index
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        {children}
    </main>
  );
}