import mysql, { type Pool } from 'mysql2/promise'

declare global {
  var databasePool: Pool | undefined
}

function createPool(): Pool {
  const connectionString = process.env.MYSQL_URL ?? process.env.DATABASE_URL
  const ssl = process.env.MYSQL_SSL === 'true'
    ? { rejectUnauthorized: false }
    : undefined

  if (connectionString) {
    const url = new URL(connectionString)
    return mysql.createPool({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.replace(/^\/+/, '')),
      waitForConnections: true,
      connectionLimit: 5,
      ssl,
    })
  }

  const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = process.env
  if (!MYSQLHOST || !MYSQLUSER || !MYSQLPASSWORD || !MYSQLDATABASE) {
    throw new Error('Falta configurar MYSQL_URL o MYSQLHOST, MYSQLUSER, MYSQLPASSWORD y MYSQLDATABASE.')
  }

  return mysql.createPool({
    host: MYSQLHOST,
    port: Number(MYSQLPORT ?? 3306),
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    ssl,
  })
}

export function getPool(): Pool {
  globalThis.databasePool ??= createPool()
  return globalThis.databasePool
}
