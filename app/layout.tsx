import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "C2C技能服务平台", // 更新标题
  description: "连接技能供需双方的平台", // 更新描述
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN"> {/* 设置语言为中文 */}
      <head>
        {/* 添加 Remixicon CDN 链接 */}
        <link 
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" 
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
} 