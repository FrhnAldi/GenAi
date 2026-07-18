export type Role = 'admin' | 'pelanggan';

export interface AuthUser {
  username: string;
  name: string;
  role: Role;
}

export interface StoredCredential extends AuthUser {
  password: string;
}
