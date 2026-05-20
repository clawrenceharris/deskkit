import { getJoinedDesksAction, getJoinedDesksCardAction, getJoinedDesksDetailAction } from "@/actions/desk";
import { useDeskContext } from "@/app/providers";
import { deskKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useJoinedDesks(userId: string | null) {
    return useQuery({
        queryKey: deskKeys.listByUserId(userId ?? ""),
        queryFn: async () => {
            if(!userId){
                throw new Error("userId is required to fetch joined desks.");
            }
            const result = await getJoinedDesksAction(userId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!userId,
    });
}

export function useJoinedDesksDetail(userId: string | null) {
    return useQuery({
        queryKey: deskKeys.listByUserId(userId ?? "", "detail"),
        queryFn: async () => {
            if(!userId){
                throw new Error("userId is required to fetch joined desks detail.");
            }
            const result = await getJoinedDesksDetailAction(userId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!userId,
    });
}

export function useJoinedDesksCard(userId: string | null) {
    const {currentDeskId} = useDeskContext();
    return useQuery({
        queryKey: deskKeys.listByUserId(userId ?? "", "card"),
        queryFn: async () => {
            if(!userId){
                throw new Error("userId is required to fetch joined desks card.");
            }
            const result = await getJoinedDesksCardAction(userId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!userId && !currentDeskId, // Only fetch joined desks cards if not in a desk
    });
}