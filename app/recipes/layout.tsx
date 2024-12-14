"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* 導航欄 */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo />
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  href="/recipes/new"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-pink-600 transition-colors"
                >
                  分享食譜
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
