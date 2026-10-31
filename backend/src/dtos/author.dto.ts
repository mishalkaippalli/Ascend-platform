

export interface ICreateAuthorDTO {
  name: string;
  origin?: string;
  profileImage?: {
    publicId: string;
    url: string;
  };
  bio?: string;
}


export interface IUpdateAuthorDTO {
  name?: string;
  origin?: string;
  profileImage?: {
    publicId: string;
    url: string;
  };
  bio?: string;
}

export interface IAuthorResponseDTO {
  id: string;
  name: string;
  slug: string;
  origin?: string;
  profileImage?: {
    url: string;
  };
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Author details with associated books, if needed later.
export interface IAuthorWithBooksDTO extends IAuthorResponseDTO {
  books: {
    id: string;
    title: string;
    slug: string;
    coverImage?: {
      url: string;
    };
  }[];
}