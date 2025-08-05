import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MOT Alert – Free and Premium MOT & Tax Reminders by Text or Email",
  description: "Never miss your MOT again. Get timely reminders via SMS or email. Free tier with email reminders, Premium tier with SMS & email for up to 3 vehicles.",
  keywords: ["MOT", "reminders", "vehicle", "tax", "insurance", "servicing"],
  openGraph: {
    title: "MOT Alert – Free and Premium MOT & Tax Reminders by Text or Email",
    description: "Never miss your MOT again. Get timely reminders via SMS or email.",
    type: "website",
    url: "https://mot-alert.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
