export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  department?: string | null;
  designation?: string | null;
  is_admin?: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  employee_id: number;
  name: string;
  email: string;
  department: string | null;
  is_admin: boolean;
};
