export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserInput = Omit<User, "id">;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UsersPageData {
  data: User[];
  pagination: PaginationMeta;
}
