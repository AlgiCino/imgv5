import './globals.css'
import SplashScreen from '@/components/ui/SplashScreen'

// This root layout is now a pass-through, as <html> and <body> are defined
// in the locale-specific layout file to enable dynamic dir and lang attributes.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SplashScreen />
      {children}
    </>
  )
}
