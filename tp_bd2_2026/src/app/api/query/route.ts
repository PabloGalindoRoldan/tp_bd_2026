import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/auth'
import { errorMessage, unauthorizedResponse } from '@/lib/api-response'
import { getPool } from '@/lib/db'

export const runtime = 'nodejs'

function stripCommentsAndQuotedText(sql: string): string {
  return sql
    .replace(/\/\*!\d*\s*([\s\S]*?)\*\//g, ' $1 ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\r\n]*/g, ' ')
    .replace(/#[^\r\n]*/g, ' ')
    .replace(/'(?:''|\\.|[^'\\])*'/g, ' ')
    .replace(/"(?:\"\"|\\.|[^"\\])*"/g, ' ')
    .replace(/`(?:``|[^`])*`/g, ' ')
    .trim()
}

function forbiddenDdl(sql: string): string | null {
  const normalized = stripCommentsAndQuotedText(sql)
  if (/^CREATE\s+(?:TEMPORARY\s+)?TABLE\b/i.test(normalized)) return 'CREATE TABLE'
  if (/^DROP\s+(?:TEMPORARY\s+)?TABLE\b/i.test(normalized)) return 'DROP TABLE'
  if (/^TRUNCATE(?:\s+TABLE)?\b/i.test(normalized)) return 'TRUNCATE TABLE'
  return null
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse()

  try {
    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null || !('sql' in body) || typeof body.sql !== 'string') {
      return NextResponse.json({ error: 'Ingresá una consulta SQL válida.' }, { status: 400 })
    }

    const sql = body.sql.trim()
    if (!sql) return NextResponse.json({ error: 'La consulta SQL está vacía.' }, { status: 400 })

    const prohibitedStatement = forbiddenDdl(sql)
    if (prohibitedStatement) {
      return NextResponse.json(
        { error: `La operación ${prohibitedStatement} está bloqueada por seguridad.` },
        { status: 403 },
      )
    }

    const [result, fields] = await getPool().query(sql)
    if (Array.isArray(result)) {
      return NextResponse.json({
        kind: 'rows',
        rows: result,
        columns: fields?.map((field) => field.name) ?? [],
        rowCount: result.length,
      })
    }

    const mutation = result as { affectedRows?: number; insertId?: number; warningStatus?: number }
    return NextResponse.json({
      kind: 'mutation',
      affectedRows: mutation.affectedRows ?? 0,
      insertId: mutation.insertId || null,
      warningStatus: mutation.warningStatus ?? 0,
    })
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 })
  }
}
