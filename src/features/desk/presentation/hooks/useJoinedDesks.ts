import { getJoinedDesksAction, getJoinedDesksCardAction, getJoinedDesksDetailAction } from "@/actions/desk";
import { useQuery } from "@tanstack/react-query";

export function useJoinedDesks(userId: string | null) {
    return useQuery({
        queryKey: ['joined-desks'],
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
        queryKey: ['joined-desks-detail'],
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
    return useQuery({
        queryKey: ['joined-desks-card'],
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
        enabled: !!userId,
    });
}