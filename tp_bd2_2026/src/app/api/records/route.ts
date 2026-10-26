import { NextRequest, NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { isAuthorized } from '@/lib/auth'
import { errorMessage, unauthorizedResponse } from '@/lib/api-response'
import { getPool } from '@/lib/db'

export const runtime = 'nodejs'

type Column = RowDataPacket & {
  columnName: string
  isNullable: 'YES' | 'NO'
  extra: string
  columnDefault: string | null
}

type SqlValue = string | number | boolean | null

function isSqlValue(value: unknown): value is SqlValue {
  return value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
}

function quoteIdentifier(identifier: string): string {
  return `\`${identifier.replaceAll('`', '``')}\``
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse()

  try {
    const body: unknown = await request.json()
    if (
      typeof body !== 'object' ||
      body === null ||
      !('table' in body) ||
      typeof body.table !== 'string' ||
      !('values' in body) ||
      typeof body.values !== 'object' ||
      body.values === null ||
      Array.isArray(body.values)
    ) {
      return NextResponse.json({ error: 'La tabla y los valores enviados no son válidos.' }, { status: 400 })
    }

    const { table, values } = body as { table: string; values: Record<string, unknown> }
    const pool = getPool()
    const [columnRows] = await pool.execute<Column[]>(
      `SELECT COLUMN_NAME AS columnName, IS_NULLABLE AS isNullable, EXTRA AS extra,
        COLUMN_DEFAULT AS columnDefault
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
      [table],
    )

    if (columnRows.length === 0) {
      return NextResponse.json({ error: 'La tabla indicada no existe en la base seleccionada.' }, { status: 404 })
    }

    const columns = columnRows.filter((column) => !column.extra.includes('auto_increment'))
    const validColumnNames = new Set(columns.map((column) => column.columnName))
    const invalidNames = Object.keys(values).filter((name) => !validColumnNames.has(name))
    if (invalidNames.length) {
      return NextResponse.json({ error: `Columnas no válidas: ${invalidNames.join(', ')}` }, { status: 400 })
    }

    const providedEntries: [string, SqlValue][] = []
    for (const [name, value] of Object.entries(values)) {
      if (value === '') continue
      if (!isSqlValue(value)) {
        return NextResponse.json({ error: `El valor de ${name} no es válido.` }, { status: 400 })
      }
      providedEntries.push([name, value])
    }
    const providedNames = new Set(providedEntries.map(([name]) => name))
    const missingRequired = columns
      .filter((column) =>
        column.isNullable === 'NO' &&
        column.columnDefault === null &&
        !providedNames.has(column.columnName),
      )
      .map((column) => column.columnName)

    if (missingRequired.length) {
      return NextResponse.json(
        { error: `Completá los campos obligatorios: ${missingRequired.join(', ')}.` },
        { status: 400 },
      )
    }
    if (providedEntries.length === 0) {
      return NextResponse.json({ error: 'Ingresá al menos un valor para insertar.' }, { status: 400 })
    }

    const names = providedEntries.map(([name]) => name)
    const placeholders = names.map(() => '?').join(', ')
    const [result] = await pool.execute(
      `INSERT INTO ${quoteIdentifier(table)} (${names.map(quoteIdentifier).join(', ')})
       VALUES (${placeholders})`,
      providedEntries.map(([, value]) => value),
    )

    const insertResult = result as { affectedRows: number; insertId: number }
    return NextResponse.json({
      message: `Registro insertado correctamente en ${table}.`,
      affectedRows: insertResult.affectedRows,
      insertId: insertResult.insertId || null,
    })
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 })
  }
}
