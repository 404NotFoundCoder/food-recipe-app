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
  return <main className="flex-1 flex">{children}</main>;
}
