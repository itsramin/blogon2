import "./globals.css";

export const metadata = {
  title: "My Blog",
  description: "A simple blog with XML storage",
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
