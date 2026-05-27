import { Prisma } from "@/lib/db/prisma";



export const notebookArgs = {
  select: {
    id: true,
    deskId: true,
    title: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    isLocked: true,
  },
} satisfies Prisma.NotebookDefaultArgs;

export const notebookMaterialArgs = {
  select: {
    id: true,
    notebookId: true,
    url: true,
    title: true,
    updatedAt: true,
    path: true,
    createdAt: true,
  },
} satisfies Prisma.MaterialDefaultArgs;
export const notebookForDetailArgs = {
    include: {
      votes: {
        select: {
          userId: true,
          isUpvote: true,
        },
      },
      downloads: {
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
      materials: {
        ...notebookMaterialArgs
      },
      creator: {
        select: {
          userId: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    }
    
  } satisfies Prisma.NotebookDefaultArgs;
export const notebookForCardArgs = {
    include: {
      votes: {
        select: {
          userId: true,
          isUpvote: true,
        },
      },
      downloads: {
        
        select: {
          userId: true,
        },
      },
      materials: {
       ...notebookMaterialArgs,
      },
      creator: {
        select: {
          userId: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    }
  } satisfies Prisma.NotebookDefaultArgs;

  export const notebookVoteArgs = {
    select: {
      userId: true,
      isUpvote: true,
    },
  } satisfies Prisma.VoteDefaultArgs;

  export type Notebook = Prisma.NotebookGetPayload<typeof notebookArgs>;  
  export type NotebookForDetail = Prisma.NotebookGetPayload<typeof notebookForDetailArgs>;
  export type NotebookForCard = Prisma.NotebookGetPayload<typeof notebookForCardArgs>;
  export type NotebookVote = Prisma.VoteGetPayload<typeof notebookVoteArgs>;
  export type NotebookMaterial = Prisma.MaterialGetPayload<typeof notebookMaterialArgs>;
