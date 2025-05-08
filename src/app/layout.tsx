import './globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        <Navbar />
        <main className="flex-1 p-8 bg-white">{children}</main>
      </body>
    </html>
  );
}