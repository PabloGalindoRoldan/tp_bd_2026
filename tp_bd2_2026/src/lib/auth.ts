import { timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

export function isAuthorized(request: NextRequest): boolean {
  const expectedToken = process.env.APP_ACCESS_TOKEN
  const authorization = request.headers.get('authorization')

  if (!expectedToken || !authorization?.startsWith('Bearer ')) return false

  const suppliedToken = authorization.slice('Bearer '.length)
  const expected = Buffer.from(expectedToken)
  const supplied = Buffer.from(suppliedToken)

  return expected.length === supplied.length && timingSafeEqual(expected, supplied)
}
