import z from "zod";
import { createProfileSchema, updateProfileSchema } from "@/lib/validation";


export type CreateProfileFormValues = z.infer<typeof createProfileSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export enum ProfileTab {
  PROFILE = "profile",
  DESKS = "desks",
  NOTEBOOKS = "notebooks",
  SETTINGS = "settings",
}