import api from '../api/axios'
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