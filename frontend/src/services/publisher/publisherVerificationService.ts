import api from '../api/axios'
import type {
  ApiResponse,
  PendingPublisher,
  RejectPublisherDTO,
} from '../../types/publisherVerification'

// Fetch all publisher applications awaiting admin review.
export const getPendingPublishers = async () => {
  const response = await api.get<ApiResponse<PendingPublisher[]>>(
    '/publishers/admin/pending',
  )

  return response.data
}

// Approve a pending publisher application.
export const approvePublisher = async (publisherId: string) => {
  const response = await api.patch(
    `/publishers/admin/${publisherId}/approve`,
  )

  return response.data
}

// Reject a pending publisher application with a reason.
export const rejectPublisher = async (
  publisherId: string,
  payload: RejectPublisherDTO,
) => {
  const response = await api.patch(
    `/publishers/admin/${publisherId}/reject`,
    payload,
  )

  return response.data
}