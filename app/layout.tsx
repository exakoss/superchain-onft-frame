import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "Superchain ONFT Frame",
  description: "Superchain ONFT Frame is a ONFT mint on Base and Zora chains on Farcaster. Powered by LayerZero and frames.js this frame enables a creator first omnichain NFT experience directly in your fee~!",
  authors: [{name: "boobavelli", url: "https://warpcast.com/boobavelli"}, {name: 'exakoss', url: 'https://github.com/exakoss'}]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
