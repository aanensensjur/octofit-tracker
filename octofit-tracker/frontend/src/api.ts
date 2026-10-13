const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asRecords(value: unknown[]): Record<string, unknown>[] {
  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`API response item at index ${index} is not an object`)
    }
    return item
  })
}

export function parseCollection(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return asRecords(payload)
  }

  if (!isRecord(payload)) {
    throw new Error('API response must be an array or a paginated object')
  }

  for (const key of ['results', 'items', 'data', 'content']) {
    const collection = payload[key]
    if (Array.isArray(collection)) {
      return asRecords(collection)
    }
    if (isRecord(collection)) {
      return parseCollection(collection)
    }
  }

  throw new Error('API response does not contain a supported collection')
}
