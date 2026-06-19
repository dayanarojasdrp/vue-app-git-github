function trimEndSlash(value) {
  return String(value ?? '').replace(/\/+$/, '')
}

function trimStartSlash(value) {
  return String(value ?? '').replace(/^\/+/, '')
}

export function getStorageBaseUrl() {
  if (import.meta.env.VITE_STORAGE_URL) {
    return trimEndSlash(import.meta.env.VITE_STORAGE_URL)
  }

  const apiUrl = trimEndSlash(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')
  return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl
}

export function getDocumentUrl(doc) {
  if (doc?.url) return doc.url
  if (doc?.download_url) return doc.download_url
  if (doc?.ruta_url) return doc.ruta_url

  const ruta = trimStartSlash(doc?.ruta)
  if (!ruta) return ''

  return `${getStorageBaseUrl()}/storage/${ruta}`
}
