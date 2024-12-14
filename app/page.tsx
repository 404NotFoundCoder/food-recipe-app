"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./contexts/AuthContext";
import Logo from "./components/Logo";
import UserMenu from "./components/UserMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
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
              {user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-pink-600 transition-colors"
                >
                  登入
                </Link>
              )}
              <Link
                href="/register"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                開始分享
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero 區域 */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-display text-gray-900 mb-6">
              分享美食，
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
                連結美好時光
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              加入我們的美食社群，探索無限美味可能，與同好分享烹飪樂趣
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/recipes"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-md"
              >
                探索食譜
              </Link>
              <Link
                href="/chat"
                className="bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md border border-gray-200"
              >
                加入討論
              </Link>
              <Link
                href="/recipes/new"
                className="bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md border border-gray-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                分享食譜
              </Link>
            </div>
          </div>
        </div>

        {/* 特色區塊 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">
                分享食譜
              </h3>
              <p className="text-gray-600">
                輕鬆分享您的獨家食譜，記錄烹飪過程，展示美味成果
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">即時交流</h3>
              <p className="text-gray-600">
                與美食愛好者即時討論，分享心得，獲取寶貴建議
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">探索靈感</h3>
              <p className="text-gray-600">
                發掘新的烹飪靈感，學習不同料理技巧，豐富美食生活
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
