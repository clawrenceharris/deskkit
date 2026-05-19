import type { MemberProfileSearchItem } from "./types";

export function getProfileLabel(profile: MemberProfileSearchItem) {
  return profile.displayName || profile.username || "Unknown user";
}

export function getProfileSearchText(profile: MemberProfileSearchItem) {
  return `${profile.displayName ?? ""} ${profile.username ?? ""}`;
}
