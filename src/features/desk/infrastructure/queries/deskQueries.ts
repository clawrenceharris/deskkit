import { notebookForCardArgs, notebookForDetailArgs } from "@/features/notebook/infrastructure/queries";
import { Prisma } from "@/lib/db/prisma";
export const memberForDetailArgs = {
  select: {
    role: true,
    profile: {
      select: {
        userId: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    },
  },
} satisfies Prisma.MemberDefaultArgs;
export type MemberForDetail = Prisma.MemberGetPayload<typeof memberForDetailArgs>;


export const deskForDetailArgs = {
    select: {
      id: true,
      name: true,
      createdAt: true,
      schoolId: true,
      creatorId: true,
      description: true,
      imageUrl: true,
      isPublic: true,
      creator: {
        select: {
          userId: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
     
      members: {
        select: {
          role: true,
            profile: {
              select: {
                schoolId: true,
                userId: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          
          
        }
      },
      notebooks: {
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
       ...notebookForCardArgs,
       
      },
        
        

    },
  } satisfies Prisma.DeskDefaultArgs;
  
  export const deskForCardArgs = {
    select: {
      id: true,
      imageUrl: true,
      isPublic: true,
      schoolId: true,
      creatorId: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      creator: {
        select: {
          userId: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      members: {
        select: {
          profile: {
            select: {
              userId: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },  
      notebooks: {
        ...notebookForCardArgs,
      },
      
    },
  } satisfies Prisma.DeskDefaultArgs;
  export const schoolDeskForDetailArgs = {
    select: {
      desk: {
        ...deskForDetailArgs,
      }
    },
  } satisfies Prisma.SchoolDeskDefaultArgs;
  export const myDeskForDetailArgs = {
    select: {
      desk:{
        ...deskForDetailArgs,
      },
    },
  } satisfies Prisma.UserDeskDefaultArgs;

  export const deskArgs = {
    select: {
      id: true,
      creatorId: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      schoolId: true,
      imageUrl: true,
      isPublic: true,
    },
  } satisfies Prisma.DeskDefaultArgs;

export type Desk = Prisma.DeskGetPayload<typeof deskArgs>;
export type DeskForDetail = Prisma.DeskGetPayload<typeof deskForDetailArgs>;
export type SchoolDeskForDetail = Prisma.SchoolDeskGetPayload<typeof schoolDeskForDetailArgs>;
export type DeskForCard = Prisma.DeskGetPayload<typeof deskForCardArgs>;
export type MyDeskForDetail = Prisma.UserDeskGetPayload<typeof myDeskForDetailArgs>;