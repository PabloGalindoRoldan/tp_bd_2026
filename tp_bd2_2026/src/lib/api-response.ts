import { NextResponse } from 'next/server'

export function unauthorizedResponse() {
  if (!process.env.APP_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'El servidor no tiene configurado APP_ACCESS_TOKEN.' },
      { status: 503 },
    )
  }

  return NextResponse.json({ error: 'Clave de acceso incorrecta o ausente.' }, { status: 401 })
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}
