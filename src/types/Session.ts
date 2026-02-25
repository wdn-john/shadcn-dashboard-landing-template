import { UserDTO } from "./User";
import { Profile } from "./Profile";

export type Session = {
  user?: UserDTO;
  profile?: Profile;
  isAuthenticated?: boolean;
  accessToken?: string | null;
};
