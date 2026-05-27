export const deskKeys = {
    all: ["desks"] as const,
    lists: () => [...deskKeys.all] as const,
    listByUserId: (userId: string, shape: "base" | "detail" | "card" = "base") => [...deskKeys.lists(), "user", userId, shape] as const,
    listBySchoolId: (schoolId: string) => [...deskKeys.lists(), "school", schoolId] as const,
    details: () => [...deskKeys.all, "detail"] as const,
    detail: (deskId: string, shape: "base" | "detail" | "card" = "base") => [...deskKeys.details(), deskId, shape] as const,
    members: (deskId: string) => [...deskKeys.all, "members", deskId] as const,
    policy: (deskId: string) => [...deskKeys.all, "policy", deskId] as const,
    schoolDesk: (schoolId: string, shape: "base" | "detail" | "card" = "base") => [...deskKeys.all, "schoolDesk", schoolId, shape] as const,
    myDesk: (userId: string, shape: "base" | "detail" = "base") => [...deskKeys.all, "myDesk", userId, shape] as const,
}

export const notebookKeys = {
    all: ["notebooks"] as const,
    lists: () => [...notebookKeys.all] as const,
    listByDeskId: (deskId: string, shape: "base" | "detail" | "card" = "base") => [...notebookKeys.lists(), "desk", deskId, shape] as const,
    listByUserId: (userId: string, shape: "base" | "detail" | "card" = "base") => [...notebookKeys.lists(), "user", userId, shape] as const,
    listBySchoolId: (schoolId: string, shape: "base" | "detail" | "card" = "base") => [...notebookKeys.lists(), "school", schoolId, shape] as const,
    details: () => [...notebookKeys.all, "detail"] as const,
    votes: (notebookId: string) => [...notebookKeys.all, "votes", notebookId] as const,
    detail: (notebookId: string, shape: "base" | "detail" | "card" = "base") => [...notebookKeys.details(), notebookId, shape] as const,
    policy: (notebookId: string) => [...notebookKeys.all, "policy", notebookId] as const,
}

export const schoolKeys = {
    all: ["schools"] as const,
    lists: () => [...schoolKeys.all] as const,
    list: () => [...schoolKeys.all] as const,
    listByUserId: (userId: string) => [...schoolKeys.list(), "user", userId] as const,
    details: () => [...schoolKeys.all, "detail"] as const,
    detail: (schoolId: string) => [...schoolKeys.all, schoolId] as const,
}

export const profileKeys = {
    all: ["profiles"] as const,
    details: () => [...profileKeys.all, "detail"] as const,
    detail: (userId: string, shape: "base" | "detail" = "base") => [...profileKeys.details(), userId, shape] as const,
}

export const presenceKeys = {
    all: ["presence"] as const,
    status: (userId: string) => [...presenceKeys.all, "status", userId] as const,
    statuses: (userIds: string[]) => [...presenceKeys.all, "statuses", ...userIds.sort()] as const,
}