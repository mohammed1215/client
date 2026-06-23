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

import { Loader2, PlusCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
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
import { DialogButton } from "../components/DialogButton";
import { useBoardInfo } from "../hooks/useBoardInfo";

export const BoardInfoPage = ({
    notificationCount = 0,
}: {
    notificationCount: number | null;
}) => {
    const {
        active,
        activePanel,
        addColumnFormOpen,
        errors,
        handleAddColumn,
        handleDeleteColumn,
        handleDragOver,
        handleDragStart,
        handleDrop,
        handleReOrder,
        handleSubmit,
        isCreateTaskOpen,
        isGettingBoardColumnsInfo,
        location,
        selectedTaskId,
        setActive,
        setActivePanel,
        setAddColumnFormOpen,
        setIsCreateTaskOpen,
        setSelectedTaskId,
        BoardColumnsData,
        isCreatingTask,
        isDeletingTask,
        isAddingTask,
    } = useBoardInfo();
    if (isGettingBoardColumnsInfo) {
        return (
            <div className="justify-center flex w-full items-center h-100vh">
                <Loader2 className="animate-spin" /> Loading
            </div>
        );
    }

    return (
        <div
            className="relative flex flex-col w-full min-w-0 min-h-screen flex-1 overflow-hidden"
            style={{
                backgroundColor: location.state?.boardBackground || "#7a0010",
            }}
        >
            {/* 🌟 THE SHADING LAYER: This sits on top of the red and forces the vignette/gradient shape */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.45) 100%)",
                    boxShadow: "inset 0 0 120px rgba(0, 0, 0, 0.6)",
                }}
            />
            <header
                className="flex relative z-10 items-center justify-between h-16 px-4  border-b border-border"
                style={{
                    background: `${location.state?.backgroundColor || "var(--background)"} !important`,
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

                    <Dialog
                        open={isCreateTaskOpen}
                        onOpenChange={setIsCreateTaskOpen}
                    >
                        <DialogButton variant="yellow">
                            <PlusCircle /> New Task
                        </DialogButton>
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
                                                                {BoardColumnsData?.map(
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
                                        {/* <FieldLabel
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
                                        </FieldContent> */}
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
                                                isLoading={isCreatingTask}
                                                variant={"defaultYellow"}
                                                className="cursor-pointer"
                                                disabled={isCreatingTask}
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
                                {
                                    <>
                                        <form onSubmit={handleReOrder}>
                                            <div className="col-list border-b border-b-border pb-3">
                                                {BoardColumnsData?.map(
                                                    (column, index) => {
                                                        return (
                                                            <div
                                                                key={`col_item_${column.id}`}
                                                                className="col-item"
                                                                draggable
                                                                onDragStart={(
                                                                    e,
                                                                ) => {
                                                                    e.dataTransfer.setData(
                                                                        "text/plain",
                                                                        index.toString(),
                                                                    );
                                                                    handleDragStart(
                                                                        index,
                                                                    );
                                                                }}
                                                                onDragOver={
                                                                    handleDragOver
                                                                }
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    handleDrop(
                                                                        index,
                                                                    );
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
                                                                        fontSize:
                                                                            "11px",
                                                                        color: "var(--text-3)",
                                                                        fontFamily:
                                                                            "'IBM Plex Mono',monospace",
                                                                    }}
                                                                >
                                                                    pos:
                                                                    {
                                                                        column.position
                                                                    }
                                                                </span>
                                                                <Button
                                                                    variant={
                                                                        "destructive"
                                                                    }
                                                                    disabled={
                                                                        column.name ===
                                                                            "Done" ||
                                                                        isDeletingTask
                                                                    }
                                                                    className="cursor-pointer"
                                                                    onClick={() =>
                                                                        handleDeleteColumn(
                                                                            column.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <X />
                                                                </Button>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </form>

                                        <Button
                                            variant={"defaultYellow"}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setAddColumnFormOpen(
                                                    !addColumnFormOpen,
                                                )
                                            }
                                        >
                                            {addColumnFormOpen
                                                ? "Close"
                                                : "Open"}{" "}
                                            Column Form
                                        </Button>
                                    </>
                                }

                                {addColumnFormOpen && (
                                    <form
                                        action=""
                                        id="change-column-name"
                                        onSubmit={handleAddColumn}
                                    >
                                        <div>
                                            <label htmlFor="col-name">
                                                Column Name
                                            </label>
                                            <Input
                                                id="col-name"
                                                name="name"
                                                className="mt-4"
                                                placeholder="Enter Column Name"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                variant={"defaultYellow"}
                                                className="cursor-pointer border-border border-3 dark:hover:border-[var(--amber-dim)] hover:scale-105"
                                                type="submit"
                                                disabled={isAddingTask}
                                            >
                                                + Add Column
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <hr />
            <div className="column-wrapper">
                <div className="column-cards">
                    {BoardColumnsData?.map((column, index) => {
                        return (
                            <ColumnCard
                                activePanel={activePanel}
                                setActivePanel={setActivePanel}
                                setSelectedTask={setSelectedTaskId}
                                key={`column_card_${column.id}_${index}`}
                                tasks={column.tasksInsideColumn}
                                title={column.name}
                                setIsCreateTaskOpen={setIsCreateTaskOpen}
                            />
                        );
                    })}
                </div>
            </div>
            <TaskSlider
                columns={BoardColumnsData}
                activePanel={activePanel}
                setActivePanel={setActivePanel}
                taskId={selectedTaskId}
            />
        </div>
    );
};
