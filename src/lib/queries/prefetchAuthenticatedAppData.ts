import { QueryClient } from "@tanstack/react-query";
import { getDeskCardsByCreatorAction } from "@/actions/desk/queries/getDesksByCreatorAction";
import { getDesksBySchoolAction } from "@/actions/desk/queries/getDesksBySchoolAction";
import { getProfileDetailAction } from "@/actions/profile";
import { getSchoolDetailAction } from "@/actions/school";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { deskKeys, profileKeys, schoolKeys } from "./keys";

/**
 * Warms the TanStack Query cache for the current session on the server so the
 * client can render without an extra round-trip (and with fewer DB hits on first paint).
 */
export async function prefetchAuthenticatedAppData(queryClient: QueryClient) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: profileKeys.detail(user.id, "detail"),
      queryFn: async () => {
        const result = await getProfileDetailAction(user.id);
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: [...deskKeys.listByUserId(user.id), "card"] as const,
      queryFn: async () => {
        const result = await getDeskCardsByCreatorAction(user.id);
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
  ]);

  const profile = queryClient.getQueryData<ProfileForDetail | null>(
    profileKeys.detail(user.id, "detail"),
  );
  const schoolId = profile?.schoolId;
  if (!schoolId) return;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: schoolKeys.detail(schoolId),
      queryFn: async () => {
        const result = await getSchoolDetailAction(schoolId);
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: deskKeys.listBySchoolId(schoolId),
      queryFn: async () => {
        const result = await getDesksBySchoolAction(schoolId);
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
  ]);
}
