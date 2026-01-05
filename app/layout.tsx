import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { RealtimeProvider } from "@/components/realtime-provider"
import { NotificationToaster } from "@/components/notification-toaster"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Follow Hub B.4.1 - Motor de Negociación",
  description: "Dashboard Analítico en Tiempo Real para Motor de Negociación de Transporte",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`} suppressHydrationWarning>
        <RealtimeProvider>{children}</RealtimeProvider>
        <NotificationToaster />
        <Analytics />
      </body>
    </html>
  )
}
