import api from '../api/axios'

import type { ApiResponse } from '../../types/publisherVerification'
import type {
  PendingPublisher,
  RejectPublisherDTO,
} from '../../types/publisherVerification'
import type { PublisherAdminListItem } from '../../types/publisher'

// Retrieve all publishers, regardless of verification status.
export async function getAllPublishers(): Promise<PublisherAdminListItem[]> {
  const response = await api.get<ApiResponse<PublisherAdminListItem[]>>(
    '/admin/publishers',
  )

  return response.data.data
}

// Retrieve publishers awaiting admin review.
export async function getPendingPublishers(): Promise<PendingPublisher[]> {
  const response = await api.get<ApiResponse<PendingPublisher[]>>(
    '/admin/publishers/pending',
  )

  return response.data.data
}

// Approve a publisher application.
export async function approvePublisher(publisherId: string) {
  const response = await api.patch(
    `/admin/publishers/${publisherId}/approve`,
  )

  return response.data
}

// Reject a publisher application with a reason.
export async function rejectPublisher(
  publisherId: string,
  payload: RejectPublisherDTO,
) {
  const response = await api.patch(
    `/admin/publishers/${publisherId}/reject`,
    payload,
  )

  return response.data
}