import { errorAlert } from './alerts'
import api from '../api/axios'
import { withScopeParams } from '../api/scope'
import {
  filterByCurrentFaculty,
  filterPPAByCurrentDepartment,
  filterStudentItemsByCurrentDepartment,
  filterStudentItemsByCurrentFaculty
} from './facultadScope'
import { isCurrentUserDepartmentHead } from './vicedecanos'

export const NO_DOCUMENT_INFO_MESSAGE = 'No hay información para hacer el documento'

const NO_INFO_STATUSES = new Set([204, 404, 409, 422])
const TEXT_BLOB_TYPES = ['application/json', 'text/plain', 'text/html']

export function hasDocumentContent(data) {
  if (!data) return false
  if (data instanceof Blob) return data.size > 0
  if (typeof data === 'string') return data.trim().length > 0
  return true
}

export function hasDocumentResponseContent(response) {
  return hasDocumentContent(response?.data)
}

export async function hasValidDocumentResponse(response) {
  if (!hasDocumentResponseContent(response)) return false

  const data = response?.data
  if (!(data instanceof Blob)) return true

  const contentType = String(data.type || response?.headers?.['content-type'] || '').toLowerCase()
  const mayBeErrorText = TEXT_BLOB_TYPES.some(type => contentType.includes(type))

  if (!mayBeErrorText) return true

  const text = await data.text()
  return !isNoDocumentInfoMessage(text)
}

function isNoDocumentInfoMessage(value) {
  const message = String(value ?? '').toLowerCase()

  return (
    message.includes('sin datos') ||
    message.includes('no hay datos') ||
    message.includes('no hay informacion') ||
    message.includes('no hay información') ||
    message.includes('empty')
  )
}

export function isNoDocumentInfoError(error) {
  const status = error?.response?.status
  const message = String(
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.message ??
    ''
  ).toLowerCase()

  return NO_INFO_STATUSES.has(status) || isNoDocumentInfoMessage(message)
}

export function notifyNoDocumentInfo() {
  errorAlert(NO_DOCUMENT_INFO_MESSAGE)
}

export async function getResolutionSourceItems(type) {
  const isAA = type === 'aa'
  const response = await api.get(isAA ? '/alumno-ayudante/activos' : '/ppa', {
    params: withScopeParams()
  })
  const data = Array.isArray(response.data) ? response.data : response.data?.data ?? []

  if (isAA) {
    return isCurrentUserDepartmentHead()
      ? await filterStudentItemsByCurrentDepartment(data)
      : await filterStudentItemsByCurrentFaculty(data)
  }

  return isCurrentUserDepartmentHead()
    ? await filterPPAByCurrentDepartment(data)
    : await filterByCurrentFaculty(data)
}

export async function hasResolutionSourceData(type) {
  const items = await getResolutionSourceItems(type)
  return items.length > 0
}

export async function assertResolutionSourceData(type) {
  if (await hasResolutionSourceData(type)) return true

  notifyNoDocumentInfo()
  return false
}
