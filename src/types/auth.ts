export type User = {
  id: string;
  email: string;
  name: string;
  imageUrl: string | null;
  createdAt?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
