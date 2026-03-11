import { UserDTO } from "./User";
import { Profile } from "./Profile";

export type Session = {
  user?: UserDTO;
  profile?: Profile;
  isAuthenticated?: boolean;
  accessToken?: string | null;
  /** True when the cookie exists but the backend rejected it (401/403). */
  staleToken?: boolean;
};
