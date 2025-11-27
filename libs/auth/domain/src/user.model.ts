export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthenticatedUser extends User {
  token: string;
}
