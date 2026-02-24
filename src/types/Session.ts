import { UserDTO } from "./User";

export type Session = {
  user?: UserDTO;
  isAuthenticated?: boolean;
  accessToken?: string | null;
};
