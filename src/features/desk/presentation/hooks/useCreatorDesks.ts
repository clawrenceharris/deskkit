"use client";
import { useQuery } from "@tanstack/react-query";
import {
    Desk,
    DeskForCard,
    DeskForDetail,
} from "../../infrastructure/queries";
import { deskKeys } from "@/lib/queries";
import { getDeskCardsByCreatorAction, getDesksByCreatorAction, getDetailedDesksByCreatorAction } from "@/actions/desk";

export function useCreatorDesks(userId: string, select?: (data: Desk[]) => Desk[]){
    return useQuery({
        queryKey: [...deskKeys.listByUserId(userId), "detail"] as const,
        queryFn: async() => {
            if(!userId){
                throw new Error("User id is required to fetch creator desks.");
            }
            const result = await getDesksByCreatorAction(userId);
            if(!result.success){
               throw result.error;
            }
            return result.data;
        },
        enabled: !!userId,
        select,
    });
}
export function useDetailedCreatorDesks(userId: string, select?: (data: DeskForDetail[]) => DeskForDetail[]){
    return useQuery({
        queryKey: [...deskKeys.listByUserId(userId), "detail"] as const,
        queryFn: async() => {
            if(!userId){
                throw new Error("User id is required to fetch creator detailed desks.");
            }
            const result = await getDetailedDesksByCreatorAction(userId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!userId,
        select,
    });
}
export function useCreatorDeskCards(userId: string, select?: (data: DeskForCard[]) => DeskForCard[]){
    return useQuery({
        queryKey: [...deskKeys.listByUserId(userId), "card"] as const,
        queryFn: async() => {
            const result = await getDeskCardsByCreatorAction(userId);
            if(!result.success){    
                throw result.error;
            }
            return result.data;
        },
        enabled: !!userId,
        select,
    });
}