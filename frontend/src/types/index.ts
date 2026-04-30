export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

//omit id cause backend will generate it later
export type UserInput = Omit<User, "id">;
