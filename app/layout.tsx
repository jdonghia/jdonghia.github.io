import { Header } from "@/app/_components/header";
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";

export const metadata = {
  title: "João Donghia",
  description: "",
};

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const inter = Inter({
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interTight.variable} ${jetBrainsMono.variable} ${inter.className} dark:text-cadet-gray dark:bg-eerie-black bg-seasalt text-gray antialiased`}
      >
        <span className="block fixed inset-0 bg-[url('/imgs/texture.png')] bg-cover bg-center bg-no-repeat opacity-[6%] dark:opacity-[4%]"></span>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header />
          <main className="p-5 z-40 relative pt-14">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
