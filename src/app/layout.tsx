import './globals.css'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="w-full h-full bg-white">
      <body className="flex w-full h-full bg-white overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-64 z-50 bg-white">
          <Navbar />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto">{children}</main>
      </body>
    </html>
  )
}
