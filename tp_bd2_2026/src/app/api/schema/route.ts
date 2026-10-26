import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/auth'
import { errorMessage, unauthorizedResponse } from '@/lib/api-response'
import { getPool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse()

  try {
    const [rows] = await getPool().query(`
      SELECT
        c.TABLE_NAME AS tableName,
        c.COLUMN_NAME AS columnName,
        c.DATA_TYPE AS dataType,
        c.COLUMN_TYPE AS columnType,
        c.IS_NULLABLE AS isNullable,
        c.COLUMN_KEY AS columnKey,
        c.EXTRA AS extra,
        c.COLUMN_DEFAULT AS columnDefault,
        foreignKeys.REFERENCED_TABLE_NAME AS referencedTable,
        foreignKeys.REFERENCED_COLUMN_NAME AS referencedColumn
      FROM information_schema.COLUMNS AS c
      LEFT JOIN information_schema.KEY_COLUMN_USAGE AS foreignKeys
        ON c.TABLE_SCHEMA = foreignKeys.TABLE_SCHEMA
        AND c.TABLE_NAME = foreignKeys.TABLE_NAME
        AND c.COLUMN_NAME = foreignKeys.COLUMN_NAME
        AND foreignKeys.REFERENCED_TABLE_NAME IS NOT NULL
      WHERE c.TABLE_SCHEMA = DATABASE()
      ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION
    `)

    return NextResponse.json({ columns: rows })
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 })
  }
}
