export type UserRole = "ROLE_CLIENT" | "ROLE_EXPERT" | "ROLE_ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
};