import { Suspense } from "react";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
