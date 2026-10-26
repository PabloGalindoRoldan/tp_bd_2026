import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AulaDB | Gestión académica',
  description: 'Administración y consultas de la base de datos académica.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
