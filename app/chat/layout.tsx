import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Logo from "@/app/components/Logo";
import UserMenu from "@/app/components/UserMenu";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 導航欄固定高度 */}
      <nav className="h-16 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full">
            <div className="flex items-center space-x-4">
              <Logo />
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="flex-1 flex">{children}</main>
    </div>
  );
}
