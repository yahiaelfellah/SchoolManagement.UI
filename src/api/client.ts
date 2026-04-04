/**
 * Shared fetch wrapper for the ASP.NET API. Uses relative `/api` URLs so the Vite dev server proxy applies.
 */
const apiBase = import.meta.env.VITE_API_BASE ?? ''

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers()
  headers.set('Accept', 'application/json')

  const token = localStorage.getItem('token')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (extra) {
    const h = new Headers(extra)
    h.forEach((value, key) => headers.set(key, value))
  }

  return headers
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${apiBase}${path}`
  const headers = buildHeaders(init.headers)

  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, { ...init, headers })

  if (res.status === 204) {
    return undefined as T
  }

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!res.ok) {
    let body: unknown
    try {
      body = isJson ? await res.json() : await res.text()
    } catch {
      body = undefined
    }
    throw new ApiError(res.status, res.statusText, body)
  }

  if (isJson) {
    return (await res.json()) as T
  }

  return (await res.text()) as T
}

export function getJson<T>(path: string) {
  return apiFetch<T>(path, { method: 'GET' })
}

export function postJson<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function putJson<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function del(path: string) {
  return apiFetch<void>(path, { method: 'DELETE' })
}
