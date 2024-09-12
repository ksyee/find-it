import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const OAGothicM = localFont({
  src: '../assets/fonts/OAGothic-Medium.woff',
  variable: '--font-oagothic-m',
  weight: '100 900',
});

const OAGothicEB = localFont({
  src: '../assets/fonts/OAGothic-ExtraBold.woff',
  variable: '--font-oagothic-eb',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: '찾아줘',
  description: '분실물, 습득물 조회 커뮤니티',
};

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko_KR">
    <body className={`${OAGothicM} ${OAGothicEB}`}>
    {children}
    </body>
    </html>
  );
}