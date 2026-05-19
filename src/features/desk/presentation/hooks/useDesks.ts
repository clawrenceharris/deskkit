import { useQuery } from "@tanstack/react-query";
import { getDeskCardsAction, getDesksAction, getDetailedDesksAction } from "@/actions/desk/queries";
import { Desk, DeskForCard, DeskForDetail } from "../../infrastructure/queries";

export function useDesks(select?: (data: Desk[]) => Desk[]) {
  return useQuery({
    queryKey: ['desks'],
    queryFn: async () => {
      const result = await getDesksAction();
      if(!result.success){
        throw result.error;
      }
      return result.data;
    },
    select,
  });
}

export function useDetailedDesks(select?: (data: DeskForDetail[]) => DeskForDetail[]){
  return useQuery({
    queryKey: ['detailed-desks'],
    queryFn: async () => {
      const result = await getDetailedDesksAction();
      if(!result.success){
        throw result.error;
      }
      return result.data;
    },
    select,
  });
}   

export function useDeskCards(select?: (data: DeskForCard[]) => DeskForCard[]){
  return useQuery({
    queryKey: ['desk-cards'],
    queryFn: async () => {
      const result = await getDeskCardsAction();
      if(!result.success){
        throw result.error;
      }
      return result.data;
    },
    select,
  });
}
