import { axiosInstance, columnEndPoints, taskEndpoints } from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2, PlusCircle, X } from "lucide-react";
import {
    Link,
    useLocation,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";
import { useDebugValue, useState } from "react";
import { getUrl } from "@/helpers/helpers";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ColumnCard } from "@/components/ColumnCard";
import { TaskSlider } from "@/components/TaskSlider";
import { InviteMemberBoardDialog } from "@/components/InviteMemberBoardDialog";

export interface ErrorResponse {
    message: string;
}

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

export const BoardInfoPage = ({
    notificationCount = 0,
}: {
    notificationCount: number | null;
}) => {
    const { token } = useUser();
    const [errors, setErrors] = useState(null);
    const [active, setActive] = useState("all");
    const { boardId } = useParams();
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const location = useLocation();

    useDebugValue("draggedItem");
    const [activePanel, setActivePanel] = useState(false);
    const queryClient = useQueryClient();
    const [_createdData, setCreatedData] = useState<CreateBoardDto | null>(
        null,
    );
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    // create task
    const mutation = useMutation({
        mutationKey: ["create-board-columns"],
        mutationFn: async (formData: CreateBoardDto) => {
            setCreatedData(formData);
            const response = await axiosInstance.post(
                getUrl(taskEndpoints.getTasksOfBoard, { boardId }),
                formData,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            return response.data;
        },
        onSuccess(data) {
            console.log(data);
            toast.success("board has been created successfully", {
                id: "create-board-columns",
            });
            queryClient.invalidateQueries({ queryKey: ["get-board-columns"] });
        },
        onError(error: AxiosError<ErrorResponse>) {
            toast.error(error.response?.data.message, {
                position: "top-center",
                id: "create-board-columns",
            });
            let errs: any = {};
            if (
                error.response?.data.message &&
                Array.isArray(error.response.data.message)
            ) {
                for (const err of error.response.data.message) {
                    if (typeof err === "string") {
                        errs[err.split(" ")[0]] = err;
                    }
                }
                setErrors(errs);
            }
            setCreatedData(null);
        },
    });

    // reorder columns
    const mutationCol = useMutation({
        mutationKey: ["reOrderColumns"],
        mutationFn: async (formData: object) => {
            const response = await axiosInstance.put(
                getUrl(columnEndPoints.reOrderColumn, { boardId }),
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        },
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(
            formData.entries(),
        ) as unknown as CreateBoardDto;
        if (!data.assigneeIds) {
            delete data.assigneeIds;
        }
        mutation.mutate(data);
    };

    // get board columns
    const query = useQuery({
        queryKey: ["get-board-columns"],
        queryFn: async () => {
            const response = await axiosInstance.get<Column[]>(
                getUrl(columnEndPoints.getOrCreateColumn, { boardId }),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        },
    });

    function handleDragStart(index: number) {
        setDraggedItem(index);
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function handleDrop(index: number) {
        // Check for null specifically, as 0 is a valid index but falsy
        if (query.data && draggedItem !== null) {
            const newItems = [...query.data];
            const [removed] = newItems.splice(draggedItem, 1);
            newItems.splice(index, 0, removed);

            for (let i = 0; i < newItems.length; i++) {
                newItems[i].position = i;
            }
            // Update the cache
            mutationCol.mutate({ newPosition: index, columnId: removed.id });
            queryClient.setQueryData(["get-board-columns"], newItems);

            setDraggedItem(null);
        }
    }

    function handleReOrder(e: React.SubmitEvent) {
        e.preventDefault();
        console.log("reorderring");
    }

    if (query.isPending) {
        return (
            <div className="justify-center flex w-full items-center h-100vh">
                <Loader2 className="animate-spin" /> Loading
            </div>
        );
    }

    return (
        <div
            className={`flex-col flex w-full flex-1 min-w-0 `}
            style={{ backgroundColor: location.state?.boardBackground }}
        >
            <header
                className="flex items-center justify-between h-16 px-4  border-b border-border"
                style={{
                    backgroundColor: `${location.state?.backgroundColor || "var(--background)"} !important`,
                }}
            >
                <div className="flex items-center gap-4">
                    {/* This button automatically toggles the Sidebar! */}
                    <SidebarTrigger />
                    <p className="capitalize">Board Info</p>
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
                    <Button
                        variant={"default"}
                        className="relative cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-700"
                    >
                        <Bell className="" />
                        {/* Unread Badge */}
                        <Badge
                            className="absolute top-0 right-0 w-5 h-5 block"
                            variant={"destructive"}
                        >
                            {notificationCount}
                        </Badge>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant={"defaultYellow"}
                                className="cursor-pointer font-bold"
                            >
                                <PlusCircle /> New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-(--auth-card)">
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                            </DialogHeader>
                            <div>
                                <form action="" onSubmit={handleSubmit}>
                                    <Field className="">
                                        <FieldLabel
                                            htmlFor="title"
                                            className="text-(--text-2)"
                                        >
                                            Title*
                                        </FieldLabel>
                                        <FieldContent>
                                            <Input
                                                name="title"
                                                className="dark:bg-(--deep) placeholder:text-(--text-4)"
                                                id="title"
                                                placeholder="Task Title"
                                            />
                                            {errors && errors["title"] && (
                                                <FieldError>
                                                    {errors["title"]}
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
                                                placeholder="Describe the task…"
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
                                                    htmlFor="columnId"
                                                    className="text-(--text-2)"
                                                >
                                                    COLUMN
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Select name="columnId">
                                                        <SelectTrigger
                                                            name="columnId"
                                                            id="columnId"
                                                            className="w-full bg-(--deep)!"
                                                        >
                                                            <SelectValue
                                                                placeholder="Select a Column"
                                                                className="placeholder:text-(--text-3)!"
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {query.data?.map(
                                                                    (
                                                                        column,
                                                                    ) => {
                                                                        return (
                                                                            <SelectItem
                                                                                key={`select_column_${column.id}`}
                                                                                value={
                                                                                    column.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    column.name
                                                                                }
                                                                            </SelectItem>
                                                                        );
                                                                    },
                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                        {errors &&
                                                            errors[
                                                                "columnId"
                                                            ] && (
                                                                <FieldError>
                                                                    {
                                                                        errors[
                                                                            "columnId"
                                                                        ]
                                                                    }
                                                                </FieldError>
                                                            )}
                                                    </Select>
                                                </FieldContent>
                                            </div>
                                            <div className="w-full md:w-1/2">
                                                <FieldLabel
                                                    htmlFor="priority"
                                                    className="text-(--text-2)"
                                                >
                                                    Priority
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Select name="priority">
                                                        <SelectTrigger
                                                            name="priority"
                                                            id="priority"
                                                            className="w-full bg-(--deep)!"
                                                        >
                                                            <SelectValue
                                                                placeholder="Select a priority"
                                                                className="placeholder:text-(--text-3)!"
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="medium">
                                                                    Medium
                                                                </SelectItem>
                                                                <SelectItem value="low">
                                                                    Low
                                                                </SelectItem>
                                                                <SelectItem value="high">
                                                                    High
                                                                </SelectItem>
                                                                <SelectItem value="urgent">
                                                                    Urgent
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                        {errors &&
                                                            errors[
                                                                "priority"
                                                            ] && (
                                                                <FieldError>
                                                                    {
                                                                        errors[
                                                                            "priority"
                                                                        ]
                                                                    }
                                                                </FieldError>
                                                            )}
                                                    </Select>
                                                </FieldContent>
                                            </div>
                                        </FieldGroup>
                                        <FieldGroup className="flex md:flex-row">
                                            <div className="md:w-1/2">
                                                <FieldLabel
                                                    htmlFor="dueDate"
                                                    className="text-(--text-2)"
                                                >
                                                    DUE DATE
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        type="date"
                                                        name="dueDate"
                                                        id="dueDate"
                                                        className="dark:bg-(--deep)"
                                                    />
                                                    {errors &&
                                                        errors["dueDate"] && (
                                                            <FieldError>
                                                                {
                                                                    errors[
                                                                        "dueDate"
                                                                    ]
                                                                }
                                                            </FieldError>
                                                        )}
                                                </FieldContent>
                                            </div>
                                            <div className="w-full md:w-1/2">
                                                <FieldLabel
                                                    htmlFor="estimatedHours"
                                                    className="text-(--text-2)"
                                                >
                                                    EST. HOURS
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        id="estimatedHours"
                                                        name="estimatedHours"
                                                        className="dark:bg-(--deep)"
                                                    />
                                                    {errors &&
                                                        errors[
                                                            "estimatedHours"
                                                        ] && (
                                                            <FieldError>
                                                                {
                                                                    errors[
                                                                        "estimatedHours"
                                                                    ]
                                                                }
                                                            </FieldError>
                                                        )}
                                                </FieldContent>
                                            </div>
                                        </FieldGroup>
                                        <FieldLabel
                                            htmlFor="assignees"
                                            className="text-(--text-2)"
                                        >
                                            Assignees
                                        </FieldLabel>
                                        <FieldContent>
                                            <Input
                                                type="text"
                                                placeholder="Search members..."
                                                id="assigneeIds"
                                                name="assigneeIds"
                                                className="dark:bg-(--deep) dark:text-(--text-3)!"
                                            />
                                            {errors &&
                                                errors["assigneeIds"] && (
                                                    <FieldError>
                                                        {errors["assigneeIds"]}
                                                    </FieldError>
                                                )}
                                        </FieldContent>
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
                                                className="cursor-pointer"
                                                type="button"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant={"defaultYellow"}
                                                className="cursor-pointer"
                                            >
                                                Create Task
                                            </Button>
                                        </div>
                                    </Field>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <InviteMemberBoardDialog workspaceId="" workspaceName="" />
                </div>
            </header>

            {/* Main Board Section */}
            <div className="main-board-section">
                <div className="filters-bar">
                    <div>
                        <Badge
                            variant={"defaultYellow"}
                            className={`main-workspace-filter ${active !== "all" ? "inactive" : ""}`}
                            onClick={() => {
                                setActive("all");
                            }}
                        >
                            All
                        </Badge>
                        <Badge
                            variant={"defaultYellow"}
                            className={`main-workspace-filter ${active !== "my-tasks" ? "inactive" : ""}`}
                            onClick={() => {
                                setActive("my-tasks");
                            }}
                        >
                            My Tasks
                        </Badge>
                        <Badge
                            variant={"defaultYellow"}
                            className={`main-workspace-filter ${active !== "urgent" ? "inactive" : ""}`}
                            onClick={() => {
                                setActive("urgent");
                            }}
                        >
                            🔴 Urgent
                        </Badge>
                        <Badge
                            variant={"defaultYellow"}
                            className={`main-workspace-filter ${active !== "high" ? "inactive" : ""}`}
                            onClick={() => {
                                setActive("high");
                            }}
                        >
                            🟠 High
                        </Badge>
                        <Badge
                            variant={"defaultYellow"}
                            className={`main-workspace-filter ${active !== "overdue" ? "inactive" : ""}`}
                            onClick={() => {
                                setActive("overdue");
                            }}
                        >
                            ⏰ Overdue
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Select>
                            <SelectTrigger className=" cursor-pointer border-2 hover:border-white! transition duration-300">
                                <SelectValue
                                    className=""
                                    placeholder="Sort By"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="s">Due Date</SelectItem>
                                    <SelectItem value="s">Priority</SelectItem>
                                    <SelectItem value="s">Created</SelectItem>
                                    <SelectItem value="s">Updated</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Dialog>
                            <DialogTrigger>
                                <Button className="cursor-pointer hover:border-white border-2">
                                    Columns
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-(--surface)">
                                <DialogHeader>
                                    <DialogTitle>Manage Columns</DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="text-xs">
                                    Drag to reorder columns. Max 10 columns per
                                    board.
                                </DialogDescription>
                                <form onSubmit={handleReOrder}>
                                    <div className="col-list border-b border-b-border pb-3">
                                        {query.data?.map((column, index) => {
                                            return (
                                                <div
                                                    key={`col_item_${column.id}`}
                                                    className="col-item"
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData(
                                                            "text/plain",
                                                            index.toString(),
                                                        );
                                                        handleDragStart(index);
                                                    }}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        handleDrop(index);
                                                    }}
                                                >
                                                    <span>⠿</span>
                                                    <Input
                                                        type="text"
                                                        defaultValue={
                                                            column.name
                                                        }
                                                        name="name"
                                                    />
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "var(--text-3)",
                                                            fontFamily:
                                                                "'IBM Plex Mono',monospace",
                                                        }}
                                                    >
                                                        pos:{column.position}
                                                    </span>
                                                    <Button
                                                        variant={"destructive"}
                                                        disabled={
                                                            column.name ===
                                                            "Done"
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <X />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                        <Button
                                            variant={"outline"}
                                            className="dark:border-border! cursor-pointer hover:bg-(--hover)! dark:bg-(--surface)"
                                        >
                                            + Add Column
                                        </Button>
                                    </div>
                                    <div className=" flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant={"outline"}
                                            className="cursor-pointer rounded-lg hover:bg-(--hover)! dark:border-border"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant={"defaultYellow"}
                                            className="cursor-pointer rounded-lg bg-(--amber) text-black font-bold"
                                        >
                                            Save Order
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <hr />
            <div className="column-wrapper">
                <div className="column-cards">
                    {query.data?.map((column, index) => {
                        return (
                            <ColumnCard
                                activePanel={activePanel}
                                setActivePanel={setActivePanel}
                                setSelectedTask={setSelectedTaskId}
                                key={`column_card_${column.id}_${index}`}
                                tasks={column.tasksInsideColumn}
                                title={column.name}
                            />
                        );
                    })}
                </div>
            </div>
            <TaskSlider
                columns={query.data}
                activePanel={activePanel}
                setActivePanel={setActivePanel}
                taskId={selectedTaskId}
            />
        </div>
    );
};
