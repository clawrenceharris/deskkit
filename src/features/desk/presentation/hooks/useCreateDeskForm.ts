"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDeskSchema } from "@/lib/validation";
import { useProfile } from "@/features/profile/presentation/hooks";
import { useCreateDesk } from "./";
import { CreateDeskFormValues } from "@/types";
import { CreateDeskResult } from "../../application/dto";

type UseCreateDeskFormProps = {
    userId: string;
    onSuccess?: (result: CreateDeskResult) => void;
    onError?: (error: string) => void;
}
export function useCreateDeskForm ({userId, onSuccess, onError}: UseCreateDeskFormProps) {
    const {createDesk, isLoading} = useCreateDesk({userId, onSuccess, onError});
    const {data: profile} = useProfile(userId);
    const form = useForm<CreateDeskFormValues>({
        resolver: zodResolver(createDeskSchema),
        defaultValues: {
            name: "",
            schoolId: profile?.schoolId ?? "",
            imageFile: null,
            isPublic: true,
            description: "",
        },
    });

    
    return {form, createDesk, isLoading};
}