'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Column = {
  tableName: string
  columnName: string
  dataType: string
  columnType: string
  isNullable: 'YES' | 'NO'
  columnKey: string
  extra: string
  columnDefault: string | null
  referencedTable: string | null
  referencedColumn: string | null
}

type QueryResult = {
  kind: 'rows' | 'mutation'
  rows?: Record<string, unknown>[]
  columns?: string[]
  rowCount?: number
  affectedRows?: number
  insertId?: number | null
}

const initialSql = 'SELECT * FROM persona LIMIT 20;'

function fieldInputType(column: Column): string {
  if (['date', 'datetime', 'timestamp', 'time'].includes(column.dataType)) {
    return ['datetime', 'timestamp'].includes(column.dataType) ? 'datetime-local' : column.dataType
  }
  if (['year', 'tinyint', 'smallint', 'mediumint', 'int', 'bigint', 'decimal', 'float', 'double'].includes(column.dataType)) {
    return 'number'
  }
  return 'text'
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export default function Home() {
  const [token, setToken] = useState('')
  const [savedToken, setSavedToken] = useState('')
  const [tables, setTables] = useState<string[]>([])
  const [columns, setColumns] = useState<Column[]>([])
  const [selectedTable, setSelectedTable] = useState('')
  const [activeTab, setActiveTab] = useState<'query' | 'form'>('query')
  const [sql, setSql] = useState(initialSql)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QueryResult | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [expandedTable, setExpandedTable] = useState('')

  const selectedColumns = useMemo(
    () => columns.filter((column) => column.tableName === selectedTable),
    [columns, selectedTable],
  )

  const formColumns = useMemo(
    () => selectedColumns.filter((column) => !column.extra.includes('auto_increment')),
    [selectedColumns],
  )

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem('aula-db-token')
    if (storedToken) {
      setToken(storedToken)
      setSavedToken(storedToken)
      void loadSchema(storedToken)
    }
  }, [])

  async function request<T>(path: string, init?: RequestInit, accessToken = savedToken): Promise<T> {
    const response = await fetch(path, {
      ...init,
      headers: {
        authorization: `Bearer ${accessToken}`,
        ...(init?.body ? { 'content-type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
    const data = await response.json() as T & { error?: string }
    if (!response.ok) throw new Error(data.error ?? 'No se pudo completar la operación.')
    return data
  }

  async function loadSchema(accessToken: string) {
    setLoading(true)
    setError('')
    try {
      const data = await request<{ columns: Column[] }>('/api/schema', undefined, accessToken)
      const names = [...new Set(data.columns.map((column) => column.tableName))]
      setColumns(data.columns)
      setTables(names)
      setSelectedTable((current) => current && names.includes(current) ? current : names[0] ?? '')
      setSavedToken(accessToken)
      window.sessionStorage.setItem('aula-db-token', accessToken)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo conectar.')
    } finally {
      setLoading(false)
    }
  }

  function signOut() {
    window.sessionStorage.removeItem('aula-db-token')
    setToken('')
    setSavedToken('')
    setTables([])
    setColumns([])
    setResult(null)
    setError('')
    setMessage('')
  }

  async function runQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setResult(null)
    try {
      const data = await request<QueryResult>('/api/query', {
        method: 'POST',
        body: JSON.stringify({ sql }),
      })
      setResult(data)
      setMessage(data.kind === 'rows'
        ? `${data.rowCount ?? 0} fila${data.rowCount === 1 ? '' : 's'} devuelta${data.rowCount === 1 ? '' : 's'}.`
        : `Operación completada: ${data.affectedRows ?? 0} fila${data.affectedRows === 1 ? '' : 's'} afectada${data.affectedRows === 1 ? '' : 's'}.`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo ejecutar la consulta.')
    } finally {
      setLoading(false)
    }
  }

  async function submitRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setResult(null)
    try {
      const values = Object.fromEntries(
        Object.entries(formValues).filter(([, value]) => value !== ''),
      )
      const data = await request<{ message: string; affectedRows: number; insertId: number | null }>(
        '/api/records',
        { method: 'POST', body: JSON.stringify({ table: selectedTable, values }) },
      )
      setMessage(`${data.message}${data.insertId ? ` ID generado: ${data.insertId}.` : ''}`)
      setFormValues({})
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo insertar el registro.')
    } finally {
      setLoading(false)
    }
  }

  if (!savedToken) {
    return (
      <main className="login-shell">
        <form
          className="login-card"
          onSubmit={(event) => {
            event.preventDefault()
            void loadSchema(token)
          }}
        >
          <div className="brand-mark">A</div>
          <p className="eyebrow">BASE DE DATOS · TP BD II</p>
          <h1>Tu espacio de trabajo</h1>
          <p className="muted">Ingresá la clave de acceso configurada para esta aplicación.</p>
          <label htmlFor="access-token">Clave de acceso</label>
          <input
            id="access-token"
            autoComplete="current-password"
            onChange={(event) => setToken(event.target.value)}
            placeholder="APP_ACCESS_TOKEN"
            required
            type="password"
            value={token}
          />
          {error && <p className="notice error-notice">{error}</p>}
          <button className="primary-button full-button" disabled={loading} type="submit">
            {loading ? 'Conectando…' : 'Conectar a la base'}
          </button>
          <p className="login-footnote">La clave se guarda únicamente en esta sesión del navegador.</p>
        </form>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a aria-label="AulaDB inicio" className="brand" href="#">
          <span className="brand-mark">A</span>
          <span>Aula<span className="brand-light">DB</span></span>
        </a>
        <div className="topbar-right">
          <span className="connection-status"><span className="status-dot" /> MySQL conectado</span>
          <button className="quiet-button" onClick={signOut} type="button">Salir</button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <div>
              <p className="eyebrow">EXPLORADOR</p>
              <h2>Esquema físico</h2>
            </div>
            <span className="table-count">{tables.length}</span>
          </div>
          {tables.length === 0 && !loading && <p className="muted sidebar-empty">No se encontraron tablas.</p>}
          <nav aria-label="Tablas de la base">
            {tables.map((table) => {
              const tableColumns = columns.filter((column) => column.tableName === table)
              const expanded = expandedTable === table
              return (
                <div className="schema-item" key={table}>
                  <button
                    aria-expanded={expanded}
                    className={`schema-table ${selectedTable === table ? 'schema-selected' : ''}`}
                    onClick={() => {
                      setSelectedTable(table)
                      setExpandedTable(expanded ? '' : table)
                    }}
                    type="button"
                  >
                    <span className="table-icon">▦</span>
                    <span>{table}</span>
                    <span className="column-count">{tableColumns.length}</span>
                  </button>
                  {expanded && (
                    <ul className="column-list">
                      {tableColumns.map((column) => (
                        <li key={column.columnName}>
                          <span
                            className={`column-key ${column.columnKey === 'PRI' ? 'primary-key' : ''} ${column.referencedTable ? 'foreign-key' : ''}`}
                            title={column.referencedTable
                              ? `Referencia a ${column.referencedTable}.${column.referencedColumn}`
                              : column.columnKey === 'PRI' ? 'Clave primaria' : ''}
                          >
                            {column.columnKey === 'PRI' ? 'PK' : column.referencedTable ? 'FK' : '·'}
                          </span>
                          <span>{column.columnName}</span>
                          <span className="column-type">{column.dataType}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </nav>
          <div className="sidebar-note">
            <span className="note-icon">i</span>
            <p>La estructura se obtiene directamente del esquema activo en MySQL.</p>
          </div>
        </aside>

        <section className="main-panel">
          <div className="page-heading">
            <div>
              <p className="eyebrow">GESTIÓN ACADÉMICA</p>
              <h1>Consola de base de datos</h1>
              <p className="muted">Consultá y administrá tus datos desde un solo lugar.</p>
            </div>
            <span className="database-badge"><span className="status-dot" /> MySQL</span>
          </div>

          <div className="tabs" role="tablist" aria-label="Modo de trabajo">
            <button
              aria-selected={activeTab === 'query'}
              className={`tab ${activeTab === 'query' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('query')}
              role="tab"
              type="button"
            >
              <span className="tab-symbol">&gt;_</span> Editor SQL
            </button>
            <button
              aria-selected={activeTab === 'form'}
              className={`tab ${activeTab === 'form' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('form')}
              role="tab"
              type="button"
            >
              <span className="tab-symbol">＋</span> Carga por formulario
            </button>
          </div>

          {activeTab === 'query' ? (
            <form className="editor-card" onSubmit={runQuery}>
              <div className="card-heading">
                <div>
                  <h2>Editor de consultas</h2>
                  <p className="muted">Ejecutá consultas SQL directamente sobre la base.</p>
                </div>
                <span className="sql-label">SQL</span>
              </div>
              <div className="query-examples">
                <span>Ejemplos:</span>
                <button onClick={() => setSql('SELECT * FROM persona LIMIT 20;')} type="button">Ver personas</button>
                <button onClick={() => setSql('SELECT * FROM materia;')} type="button">Ver materias</button>
              </div>
              <label className="visually-hidden" htmlFor="sql-editor">Consulta SQL</label>
              <textarea
                autoCapitalize="off"
                autoComplete="off"
                className="sql-editor"
                id="sql-editor"
                onChange={(event) => setSql(event.target.value)}
                spellCheck={false}
                value={sql}
              />
              <div className="editor-footer">
                <p className="editor-warning">CREATE TABLE, DROP TABLE y TRUNCATE TABLE están bloqueados.</p>
                <button className="primary-button" disabled={loading || !sql.trim()} type="submit">
                  <span>{loading ? '…' : '▶'}</span> {loading ? 'Ejecutando' : 'Ejecutar consulta'}
                </button>
              </div>
            </form>
          ) : (
            <form className="editor-card form-card" onSubmit={submitRecord}>
              <div className="card-heading">
                <div>
                  <h2>Insertar un registro</h2>
                  <p className="muted">Elegí una tabla y completá los campos disponibles.</p>
                </div>
                <span className="sql-label">INSERT</span>
              </div>
              <label className="field-label" htmlFor="table-select">Tabla</label>
              <select
                id="table-select"
                onChange={(event) => {
                  setSelectedTable(event.target.value)
                  setFormValues({})
                }}
                value={selectedTable}
              >
                {tables.map((table) => <option key={table} value={table}>{table}</option>)}
              </select>
              {formColumns.length > 0 ? (
                <div className="form-grid">
                  {formColumns.map((column) => {
                    const required = column.isNullable === 'NO' && column.columnDefault === null
                    const inputType = fieldInputType(column)
                    const isLongText = ['text', 'mediumtext', 'longtext'].includes(column.dataType)
                    return (
                      <div className="field" key={column.columnName}>
                        <label className="field-label" htmlFor={`field-${column.columnName}`}>
                          {column.columnName}
                          {required && <span className="required-mark"> *</span>}
                          {column.referencedTable && (
                            <span className="foreign-hint"> → {column.referencedTable}.{column.referencedColumn}</span>
                          )}
                        </label>
                        {isLongText ? (
                          <textarea
                            id={`field-${column.columnName}`}
                            onChange={(event) => setFormValues({ ...formValues, [column.columnName]: event.target.value })}
                            placeholder={column.columnDefault === null ? 'Ingresá un valor' : 'Opcional'}
                            required={required}
                            rows={3}
                            value={formValues[column.columnName] ?? ''}
                          />
                        ) : (
                          <input
                            id={`field-${column.columnName}`}
                            onChange={(event) => setFormValues({ ...formValues, [column.columnName]: event.target.value })}
                            placeholder={column.columnDefault === null ? 'Ingresá un valor' : 'Opcional'}
                            required={required}
                            step={inputType === 'number' && ['decimal', 'float', 'double'].includes(column.dataType) ? 'any' : undefined}
                            type={inputType}
                            value={formValues[column.columnName] ?? ''}
                          />
                        )}
                        <span className="field-type">{column.columnType}{column.columnDefault !== null ? ' · opcional' : ''}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="muted form-empty">Seleccioná una tabla para ver sus campos.</p>
              )}
              <div className="editor-footer">
                <p className="editor-warning">Los campos autoincrementales se generan automáticamente.</p>
                <button className="primary-button" disabled={loading || !selectedTable} type="submit">
                  <span>{loading ? '…' : '＋'}</span> {loading ? 'Guardando' : 'Insertar registro'}
                </button>
              </div>
            </form>
          )}

          {(message || error) && (
            <div className={`notice ${error ? 'error-notice' : 'success-notice'}`} role="status">
              <span>{error ? '!' : '✓'}</span>
              {error || message}
            </div>
          )}

          <section aria-live="polite" className="results-card">
            <div className="results-heading">
              <div>
                <h2>Resultados</h2>
                <p className="muted">
                  {result?.kind === 'rows'
                    ? `${result.rowCount ?? 0} registros`
                    : result?.kind === 'mutation' ? 'Resumen de ejecución' : 'Los resultados aparecerán acá.'}
                </p>
              </div>
              {result?.kind === 'rows' && <span className="result-count">{result.rowCount} filas</span>}
            </div>
            {!result ? (
              <div className="empty-results">
                <div className="empty-icon">▤</div>
                <p>Sin resultados para mostrar</p>
                <span>Ejecutá una consulta SQL para ver los datos.</span>
              </div>
            ) : result.kind === 'mutation' ? (
              <div className="mutation-result">
                <div><span>Filas afectadas</span><strong>{result.affectedRows}</strong></div>
                {result.insertId !== null && result.insertId !== undefined && (
                  <div><span>ID generado</span><strong>{result.insertId}</strong></div>
                )}
              </div>
            ) : result.rows?.length === 0 ? (
              <div className="empty-results compact-empty"><p>La consulta no devolvió filas.</p></div>
            ) : (
              <div className="results-table-wrap">
                <table>
                  <thead>
                    <tr>{result.columns?.map((column) => <th key={column}>{column}</th>)}</tr>
                  </thead>
                  <tbody>
                    {result.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {result.columns?.map((column) => (
                          <td key={column}>{formatCell(row[column])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <footer className="page-footer">AulaDB <span>·</span> Herramienta de gestión académica</footer>
        </section>
      </div>
    </main>
  )
}
