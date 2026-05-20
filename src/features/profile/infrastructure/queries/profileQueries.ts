import { deskForCardArgs, deskForDetailArgs } from "@/features/desk/infrastructure/queries";
import { Prisma } from "@/lib/db/prisma";

export const profileForDetailArgs = {
include: {
    school: {
        select: {
            id: true,
            name: true,
        },
    },
    createdDesks: {
        ...deskForCardArgs,
    },
    memberships: {
        select: {
            role: true,
            desk: {
               ...deskForCardArgs
            },
        },
    },
    notebooks: {
        select: {
            id: true,
            title: true,
            votes: true,
            materials: true,
        },
    },
    myDesk: {
        select:{
            desk:{
                ...deskForDetailArgs,
            }
        }
            
            
    },
},

} satisfies Prisma.ProfileDefaultArgs;

export const profileForButtonArgs = {
select: {
    userId: true,
    username: true,
    displayName: true,
    avatarUrl: true,
},
} satisfies Prisma.ProfileDefaultArgs;

export const profileArgs = {
select: {
    userId: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    schoolId: true,
},


} satisfies Prisma.ProfileDefaultArgs;


export const profileForPolicyArgs = {
    include: {
        myDesk: {
            select: {
                deskId: true
            }
        },
        memberships: {
            select: {
                role: true,
                desk: {
                    select:{
                        id: true,
                        isPublic: true,
                        creatorId: true
                        
                    }
                },
            },
        },
    },
} satisfies Prisma.ProfileDefaultArgs;

export type Profile = Prisma.ProfileGetPayload<typeof profileArgs>;
export type ProfileForDetail = Prisma.ProfileGetPayload<typeof profileForDetailArgs>;
export type ProfileForButton = Prisma.ProfileGetPayload<typeof profileForButtonArgs>;
export type ProfileForPolicy = Prisma.ProfileGetPayload<typeof profileForPolicyArgs>;