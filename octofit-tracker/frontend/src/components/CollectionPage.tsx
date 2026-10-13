import { useEffect, useState } from 'react'
import { apiUrl, parseCollection } from '../api'

type CollectionPageProps = {
  endpoint: string
  title: string
  description: string
  request: typeof fetch
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (Array.isArray(value)) {
    return value.map(displayValue).join(', ')
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const displayName =
      [record.firstName, record.lastName].filter(Boolean).join(' ') ||
      record.name ||
      record.title ||
      record.username ||
      record.email
    return typeof displayName === 'string' ? displayName : JSON.stringify(value)
  }

  return String(value)
}

function CollectionPage({ endpoint, title, description, request }: CollectionPageProps) {
  const [records, setRecords] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCollection() {
      try {
        const response = await request(apiUrl(endpoint), { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const payload: unknown = await response.json()
        setRecords(parseCollection(payload))
        setError(null)
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'An unexpected error occurred while loading data',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadCollection()
    return () => controller.abort()
  }, [endpoint, request])

  const columns = [...new Set(records.flatMap((record) => Object.keys(record)))].filter(
    (column) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(column),
  )

  return (
    <section aria-labelledby="collection-title">
      <div className="mb-4">
        <h1 className="h2 mb-2" id="collection-title">
          {title}
        </h1>
        <p className="text-body-secondary">{description}</p>
      </div>

      {loading && (
        <div className="text-body-secondary" role="status">
          Loading {title.toLowerCase()}…
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Could not load {title.toLowerCase()}: {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="alert alert-light border" role="status">
          No {title.toLowerCase()} found.
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="table-responsive rounded bg-white shadow-sm">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((column) => (
                  <th className="text-capitalize" key={column} scope="col">
                    {column.replace(/([A-Z])/g, ' $1')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={String(record._id ?? record.id ?? index)}>
                  {columns.map((column) => (
                    <td key={column}>{displayValue(record[column])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default CollectionPage
