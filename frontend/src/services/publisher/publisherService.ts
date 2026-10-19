import api from '../api/axios'
import type { PublisherProfile } from '../../types/publisherProfile'
import type {
  PublisherSignupDTO,
  PublisherSignupResponseDTO,
} from '../../types/auth'

export async function publisherSignup(
  data: PublisherSignupDTO,
): Promise<PublisherSignupResponseDTO> {
  const response = await api.post<{
    success: boolean
    data: PublisherSignupResponseDTO
  }>('/publishers/signup', data)

  return response.data.data
}

export async function getMyProfile(): Promise<PublisherProfile> {
  const response = await api.get<{
    success: boolean
    message: string
    data: PublisherProfile
  }>('/publishers/me')

  return response.data.data
}