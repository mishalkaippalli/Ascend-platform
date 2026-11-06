import api from '../api/axios'
import type {
  Author,
  CreateAuthorDTO,
  CreateAuthorResponse,
  GetAuthorsResponse,
} from '../../types/author'

export async function getMyAuthors(): Promise<Author[]> {
  const response = await api.get<GetAuthorsResponse>(
    '/publishers/authors',
  )

  return response.data.data
}

export async function createAuthor(
  data: CreateAuthorDTO,
): Promise<Author> {
  const response = await api.post<CreateAuthorResponse>(
    '/publishers/authors',
    data,
  )

  return response.data.data
}