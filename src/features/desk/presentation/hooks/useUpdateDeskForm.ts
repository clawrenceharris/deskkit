"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDeskSchema } from "@/lib/validation";
import { useDesk, useUpdateDesk } from "./";
import { UpdateDeskFormValues } from "@/types";
import { UpdateDeskResult } from "../../application/dto";

type UseUpdateDeskFormProps = {
    deskId: string;
    onSuccess?: (result: UpdateDeskResult) => void;
    onError?: (error: string) => void;
}
export function useUpdateDeskForm ({deskId, onSuccess, onError}: UseUpdateDeskFormProps) {
    const {updateDesk, isLoading, error} = useUpdateDesk({deskId, onSuccess, onError});
    const { data: desk } = useDesk(deskId);
    const form = useForm<UpdateDeskFormValues>({
        resolver: zodResolver(updateDeskSchema),
        defaultValues: {
            name: desk?.name ?? "",
            schoolId: desk?.schoolId ?? "",
            imageFile: null,
            isPublic: desk?.isPublic ?? true,
        },
    });

    
    return {form, updateDesk, error, isLoading};
}