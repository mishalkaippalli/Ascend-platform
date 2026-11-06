export interface Author {
  id: string
  name: string
  slug: string
  origin?: string
  profileImage?: {
    url: string
  }
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAuthorDTO {
  name: string
  origin?: string
  bio?: string
  profileImage?: {
    publicId: string
    url: string
  }
}

export interface GetAuthorsResponse {
  success: boolean
  message: string
  data: Author[]
}

export interface CreateAuthorResponse {
  success: boolean
  message: string
  data: Author
}