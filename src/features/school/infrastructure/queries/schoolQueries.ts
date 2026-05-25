import { deskForDetailArgs } from "@/features/desk/infrastructure/queries";
import { Prisma } from "@/lib/db/prisma";

export const schoolForDetailArgs = {
    select: {
        id: true,
        name: true,
        students: {
            select: {
                userId: true,
                username: true,
                displayName: true,
                avatarUrl: true,
            },
        },
        schoolDesk: {
            
            select: {
                schoolId: true,
                desk: {
                    ...deskForDetailArgs,
                },
            },
        },
        desks: true,
    },
} satisfies Prisma.SchoolDefaultArgs;
export const schoolForPolicyArgs = {
    include: {
        
        schoolDesk: true,
    },
} satisfies Prisma.SchoolDefaultArgs;

export const schoolArgs = {
    select: {
        id: true,
        name: true,
    },
} satisfies Prisma.SchoolDefaultArgs;
export type School = Prisma.SchoolGetPayload<typeof schoolArgs>;
export type SchoolForDetailArgs = typeof schoolForDetailArgs;
export type SchoolForDetail = Prisma.SchoolGetPayload<typeof schoolForDetailArgs>;
export type SchoolForPolicy = Prisma.SchoolGetPayload<typeof schoolForPolicyArgs>;