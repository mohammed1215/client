export interface CreateBoardDto {
    title: string;
    description: string;
    columnId: string;
    priority: string;
    dueDate: string;
    estimatedHours: number;
    assigneeIds?: string[];
    tagIds?: string[];
}
export interface Visibility {
    PUBLIC: "PUBLIC";
    PRIVATE: "PRIVATE";
    WORKSPACE: "WORKSPACE";
}

export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    avatarUrl: string | null;
    bio: string | null;
    emailVerified: boolean | null;
    emailPreference: string;
    isActive: false;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
}

export type SearchTypes = "ALL" | "TASKS" | "BOARDS";

export interface SearchQueryDto {
    q: string;
    workspaceId?: string;
    type?: SearchTypes;
    page?: number;
    limit?: number;
}

export interface WorkspaceMember {
    id: string;
    role: string;
    joinedAt: string;
    user: User;
}
export interface Board {
    id: string;
    name: string;
    description: string;
    backgroundColor: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    archivedAt: string;
    visibility: string;
    deletedAt: string | null;
    members: any[];
}

export interface Column {
    id: string;
    name: string;
    position: number;
    createdAt: string;
    tasksInsideColumn: Task[];
}
export interface CreateCommentDto {
    content: string;
    mentionedUserIds: string[];
}
export interface Task {
    id: string;
    taskNumber: string;
    title: string;
    description: string | null;
    priority: string;
    dueDate: string | null;
    estimatedHours: number | null;
    position: number;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    deletedAt: string | null;
    board?: Board;
    column?: Column;
    createdBy?: User;
    assignedTasks?: any[];
    watchers?: Watcher[];
    attachments?: Attachment[];
    comment?: Comment[];
    activities: any[];
}

export interface Attachment {
    id: string;
    filename: string;
    originalFilename: string;
    fileSize: number;
    contentType: string;
    storagePath: string;
    createdAt: string;
}
export interface Comment {
    id: string;
    content: string;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    task?: Task;
    author?: User;
}
export interface Watcher {
    id: "3fc91524-1bf5-4734-80a2-398e1225989c";
    watchedAt: "2026-02-21T20:39:19.922Z";
    user?: User;
}

export interface WorkspaceDto {
    id: string;
    name: string;
    slug: string;
    description: string;
    isPrivate: false;
    createdAt: string;
    updatedAt: string;
    owner: User;
    members: WorkspaceMember[];

    boards: Board[];
}

export interface GetWorkspacesDto {
    workspaces: WorkspaceDto[];
    workspaceCount: number;
    pageCount: number;
}
export interface Visibility {
    PUBLIC: "PUBLIC";
    PRIVATE: "PRIVATE";
    WORKSPACE: "WORKSPACE";
}
export interface dashboardResponse {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    tasksByPriority: {
        high: number;
        low: number;
        medium: number;
        urgent: number;
    };
    recentActivity: [
        {
            id: "15c5ebd5-38a9-4297-880c-f3f5d9d98c8f";
            task: {
                id: "5f0ea110-dd51-4a48-88a2-adc9f83f4c89";
                taskNumber: "Task-1";
                title: "task 1";
                description: "welcome ";
                priority: "low";
                dueDate: "2026-04-24T21:00:00.000Z";
                estimatedHours: "5";
                position: 0;
                createdAt: "2026-04-20T18:09:45.483Z";
                updatedAt: "2026-04-20T18:09:45.483Z";
                completedAt: null;
                deletedAt: null;
                board: {
                    id: "a63634ca-675c-432b-9fcf-a9efb815366b";
                    name: "Board 1";
                    description: "welcome to board 1";
                    backgroundColor: "#7e2525";
                    isArchived: false;
                    createdAt: "2026-04-20T13:30:20.860Z";
                    updatedAt: "2026-04-20T13:30:20.860Z";
                    archivedAt: null;
                    visibility: "PRIVATE";
                    deletedAt: null;
                    workspace: {
                        id: "79e00828-8a39-4b69-82dd-e3cd224964cc";
                        name: "workspace 1";
                        slug: "workspace-1";
                        description: "welcome here";
                        isPrivate: true;
                        createdAt: "2026-04-20T13:28:59.203Z";
                        updatedAt: "2026-04-20T13:28:59.203Z";
                    };
                };
            };
            activityType: "created";
            fieldName: "task";
            oldValue: null;
            newValue: {
                title: "task 1";
                priority: "low";
            };
            createdAt: "2026-04-20T18:09:45.498Z";
        },
    ];
    completionTrend: {
        date: string;
        count: number;
    }[];
    tasksByAssignee: {
        firstname: string;
        lastname: string;
        avatarUrl: string | null;
        userId: string;
        count: number;
    }[];
    mostActiveBoards: {
        boardId: string;
        boardName: string;
        taskCount: number;
    }[];
}
