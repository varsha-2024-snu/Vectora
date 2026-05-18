import './globals.css'
import { AppProvider } from '@/components/AppContext'

export const metadata = {
  title: 'Vectora — Goal Intelligence Platform',
  description: 'Set goals, track achievement, and build a culture of performance.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
