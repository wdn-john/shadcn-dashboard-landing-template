import type { Profile } from "@/types/Profile";

// Keep the same public shape as before, but make it reusable via a factory.
// We inject "api" (and optionally "storage") so this shared store stays platform-agnostic.
export type ProfileStore = {
  profile: Profile | undefined;
  initials: string;
  // Use string keys for profileMap to match Profile.id shape
  profileMap: Map<string, Profile>;
  loading: boolean;

  setProfileMap: (profile: Profile) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: () => Promise<Profile | undefined>;
  getProfileMap: () => Map<string, Profile>;
};