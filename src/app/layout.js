import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import DarkModeScript from './components/DarkModeScript';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StockTracker - Real-time Stock Analysis Platform",
  description: "A comprehensive stock analysis platform with real-time data and interactive charts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DarkModeScript />
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
              <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p> {new Date().getFullYear()} StockTracker. All rights reserved.</p>
                <p className="mt-2">Data provided for informational purposes only. Not financial advice.</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
