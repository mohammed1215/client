import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader, Loader2, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BoardCard } from "@/components/Board";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InviteMemberDialog } from "@/components/InviteMemberDialog";
import { WorkspaceDashboard } from "@/components/WorkspaceDashboard";
import { DialogButton } from "../components/DialogButton";
import { useBoards } from "../hooks/useBoards";

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
// interface User {
//   id: string;
//   email: string;
//   firstname: string;
//   lastname: string;
//   avatarUrl: string | null;
//   bio: string | null;
//   emailVerified: boolean | null;
//   emailPreference: string;
//   isActive: false;
//   createdAt: string;
//   updatedAt?: string;
//   lastLoginAt: string | null;
// }
// interface WorkspaceMember {
//   id: string;
//   role: string;
//   joinedAt: string;
//   user: User;
// }
// interface Board {
//     id: string;
//     name: string;
//     description: string;
//     backgroundColor: string;
//     isArchived: boolean;
//     createdAt: string;
//     updatedAt?: string;
//     archivedAt: string;
//     visibility: string;
//     deletedAt: string | null;
// }

export const BoardsPage = (
    {
        // notificationCount = 0,
        // setPrevWorkspace,
    }: {
        notificationCount: number | null;
        // setPrevWorkspace;
    },
) => {
    const {
        workspaceId,
        location,
        errors,
        activeFilter,
        setActiveFilter,
        dashboard,
        isDashboardLoading,
        isDashboardSuccess,
        boards,
        isBoardsPending,
        isBoardsSuccess,
        handleCreateBoard,
    } = useBoards();

    return (
        <div className="flex-col flex w-full">
            <header className="flex items-center justify-between h-16 px-4 bg-background border-b border-border">
                <div className="flex items-center gap-4">
                    {/* This button automatically toggles the Sidebar! */}
                    <SidebarTrigger />
                    <p className="capitalize">
                        {location.pathname.split("/").at(-1)}
                    </p>
                </div>

                {/* Notifications and Profile */}
                <div className="flex items-center gap-4 text-gray-500">
                    {/* Search Input Placeholder */}
                    <Link to={"/search"}>
                        <Input
                            type="text"
                            placeholder="Search tasks..."
                            className="hidden md:block text-sm cursor-pointer bg-input"
                        />
                    </Link>
                    <Dialog>
                        <DialogButton variant="yellow">
                            <PlusCircle /> New Board
                        </DialogButton>
                        <DialogContent className="bg-(--auth-card)">
                            <DialogHeader>
                                <DialogTitle>New Workspace</DialogTitle>
                            </DialogHeader>
                            <div>
                                <form action="" onSubmit={handleCreateBoard}>
                                    <Field className="">
                                        <FieldLabel
                                            htmlFor="name"
                                            className="text-(--text-2)"
                                        >
                                            Board Name *
                                        </FieldLabel>
                                        <FieldContent>
                                            <Input
                                                name="name"
                                                className="dark:bg-(--deep) placeholder:text-(--text-4)"
                                                id="name"
                                                placeholder="e.g. Backend API"
                                            />
                                            {errors && errors["name"] && (
                                                <FieldError>
                                                    {errors["name"]}
                                                </FieldError>
                                            )}
                                        </FieldContent>
                                        <FieldLabel
                                            htmlFor="description"
                                            className="text-(--text-2)"
                                        >
                                            Description
                                        </FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                name="description"
                                                className="dark:bg-(--deep) placeholder:text-(--text-4)"
                                                id="description"
                                            />
                                            {errors &&
                                                errors["description"] && (
                                                    <FieldError>
                                                        {errors["description"]}
                                                    </FieldError>
                                                )}
                                        </FieldContent>
                                        <FieldGroup className="flex md:flex-row">
                                            <div className="md:w-1/2">
                                                <FieldLabel
                                                    htmlFor="background"
                                                    className="text-(--text-2)"
                                                >
                                                    Background
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        name="backgroundColor"
                                                        type="color"
                                                        className="dark:bg-(--deep) placeholder:text-(--text-4)"
                                                        id="background"
                                                        placeholder="What does your team work on?"
                                                    />
                                                    {errors &&
                                                        errors[
                                                            "background"
                                                        ] && (
                                                            <FieldError>
                                                                {
                                                                    errors[
                                                                        "background"
                                                                    ]
                                                                }
                                                            </FieldError>
                                                        )}
                                                </FieldContent>
                                            </div>
                                            <div className="w-full md:w-1/2">
                                                <FieldLabel
                                                    htmlFor="visibility"
                                                    className="text-(--text-2)"
                                                >
                                                    Visibility
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Select name="visibility">
                                                        <SelectTrigger
                                                            name="visibility"
                                                            id="visibility"
                                                            className="w-full bg-(--deep)!"
                                                        >
                                                            <SelectValue
                                                                placeholder="Select a Visibility"
                                                                className="placeholder:text-(--text-3)!"
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="PRIVATE">
                                                                    Private
                                                                </SelectItem>
                                                                <SelectItem value="WORKSPACE">
                                                                    Workspace
                                                                </SelectItem>
                                                                <SelectItem value="PUBLIC">
                                                                    Public
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                        {errors &&
                                                            errors[
                                                                "visibility"
                                                            ] && (
                                                                <FieldError>
                                                                    {
                                                                        errors[
                                                                            "visibility"
                                                                        ]
                                                                    }
                                                                </FieldError>
                                                            )}
                                                    </Select>
                                                </FieldContent>
                                            </div>
                                        </FieldGroup>
                                        <div className="flex bg-(--raised) p-3 rounded-lg border border-border items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-(--text-3) text-xs">
                                                    💡 3 default columns: To Do,
                                                    In Progress, Done
                                                </span>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant={"defaultYellow"}
                                                className="cursor-pointer"
                                            >
                                                Create Board
                                            </Button>
                                        </div>
                                    </Field>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <InviteMemberDialog
                        workspaceName={location.state?.workspaceName}
                        workspaceId={workspaceId as string}
                    />
                </div>
            </header>
            {/* Workspace Dashboard */}
            {isDashboardLoading && (
                <div className="w-full h-50 flex justify-center items-center">
                    getting workspace data...
                    <Loader className="animate-spin " />
                </div>
            )}
            {isDashboardSuccess && (
                <WorkspaceDashboard
                    totalTasks={dashboard?.totalTasks ?? 0}
                    completedTasks={dashboard?.completedTasks ?? 0}
                    overdueTasks={dashboard?.overdueTasks ?? 0}
                    chartData={dashboard?.tasksByPriority}
                    completedTrendChartData={dashboard?.completionTrend}
                    activeBoardData={dashboard?.mostActiveBoards}
                    tasksByAssignee={dashboard?.tasksByAssignee}
                    recentActivity={dashboard?.recentActivity}
                />
            )}

            <hr />

            {/* Main Board Section */}
            <div className="main-workspace-section">
                <h2 className="main-workspace-header capitalize text-2xl font-bold">
                    {location.pathname.split("/").at(-1)}
                </h2>
                <p className="main-workspace-text text-(--text) text-sm">
                    Your organizations and teams
                </p>
                <div className="main-workspace-filters ">
                    <Badge
                        variant={"defaultYellow"}
                        className={`main-workspace-filter ${activeFilter !== "all" ? "inactive" : ""}`}
                        onClick={() => {
                            setActiveFilter("all");
                        }}
                    >
                        All
                    </Badge>
                    <Badge
                        variant={"defaultYellow"}
                        className={`main-workspace-filter ${activeFilter !== "active" ? "inactive" : ""}`}
                        onClick={() => {
                            setActiveFilter("active");
                        }}
                    >
                        Active
                    </Badge>
                    <Badge
                        variant={"defaultYellow"}
                        className={`main-workspace-filter ${activeFilter !== "archived" ? "inactive" : ""}`}
                        onClick={() => {
                            setActiveFilter("archived");
                        }}
                    >
                        Archived
                    </Badge>
                </div>
            </div>
            <hr />
            {isBoardsPending && (
                <div className="justify-center flex w-full items-center h-50">
                    <Loader2 className="animate-spin" /> Loading
                </div>
            )}
            {/* Board list */}
            {isBoardsSuccess && (
                <div className="workspace-cards">
                    {boards?.map((board) => {
                        // let role = 'member'
                        // if(workspace.owner.id === user.id){
                        //     role = 'owner'
                        // }else{
                        //     workspace.members.forEach(member=>{
                        //         if(member.user.id === user.id){
                        //             role = member.role
                        //         }
                        //     })
                        // }
                        return (
                            <Link
                                key={board.id}
                                to={`/boards/${board.id}`}
                                state={{
                                    boardBackground: board.backgroundColor,
                                }}
                            >
                                <BoardCard
                                    title={board.name}
                                    updatedAt={board.updatedAt}
                                    description={board.description}
                                    visibility={board.visibility}
                                />
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
