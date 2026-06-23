import { formatterDate } from "@/helpers/helpers";
import type { Column } from "../types/types";
import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MentionsInput, Mention } from "react-mentions";
import { ActivityTab } from "./ActivityTab";
import { DetailsTaskTab } from "./DetailsTab";
import { useTaskSlider } from "../hooks/useTaskSlider";
const mentionsStyle = {
    control: {
        fontSize: 14,
        fontWeight: "normal",
    },
    input: {
        margin: 0,
        outline: "none",
        border: "none",
    },
    suggestions: {
        list: {
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            overflow: "hidden",
            fontSize: 14,
        },
        item: {
            padding: "8px 12px",
            borderBottom: "1px solid var(--border)",
            color: "var(--text-2)",
            cursor: "pointer",
            // 🌟 This targets the hovered or arrow-key selected item
            "&focused": {
                backgroundColor: "var(--raised)",
                color: "var(--amber)",
            },
        },
    },
};

export const TaskSlider = ({
    taskId,
    setActivePanel,
    activePanel,
    columns,
}: {
    taskId: string | null;
    setActivePanel: (activePanel: boolean) => void;
    activePanel: boolean;
    columns?: Column[] | null;
}) => {
    const {
        handleAddAssignee,
        handleAddComment,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleMoveTask,
        handleRemoveAssignee,
        handleUploadAttachment,
        isGettingTaskDetails,
        queryTaskDetails,
        assigneeIds,
        setAssigneeIds,
        fileName,
        isDragging,
        fileInputRef,
        isMoving,
        commentText,
        mentionData,
        setCommentText,
        setFileName,
        isUploadingAttachment,
        progress,
    } = useTaskSlider(taskId);

    return (
        <div className={`detail-panel ${activePanel ? "active" : ""}`}>
            {isGettingTaskDetails ? (
                <div className="justify-center flex w-full items-center h-100vh">
                    <Loader2 className="animate-spin" /> Loading
                </div>
            ) : (
                <>
                    {/* detail header */}
                    <div className="detail-header">
                        <div className="detail-header-left">
                            <h2 className="task-number">
                                {queryTaskDetails?.taskNumber}
                            </h2>
                            <span className="priority">
                                {queryTaskDetails?.priority}
                            </span>
                        </div>
                        <span
                            onClick={() => setActivePanel(false)}
                            className="hover:bg-(--hover) hover:text-(--text) text-(--text-3) cursor-pointer transition px-1 py-2 rounded-md"
                        >
                            <X />
                        </span>
                    </div>

                    <hr />
                    {/* detail body */}
                    <div className="detail-body">
                        <h2 className="task-title">
                            {queryTaskDetails?.title}
                        </h2>
                        <div className="detail-meta-grid grid-cols-1 sm:grid-cols-2">
                            <div className="meta-item">
                                <div className="meta-label">Status</div>
                                {/* <div className="meta-value">{queryTaskDetails.column}</div> */}
                            </div>
                            <div className="meta-item">
                                <div className="meta-label">Priority</div>
                                <div className="meta-value">
                                    {queryTaskDetails?.priority}
                                </div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-label">Due Date</div>
                                <div className="meta-value text-(--orange)">
                                    {queryTaskDetails?.dueDate &&
                                        format(
                                            queryTaskDetails.dueDate,
                                            "MMM dd, yyyy",
                                        )}
                                </div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-label">EST. Hours</div>
                                <div className="meta-value">
                                    {queryTaskDetails?.estimatedHours}h
                                </div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-label">Column</div>
                                <div className="meta-value">
                                    {queryTaskDetails?.column?.name}
                                </div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-label">Created By</div>
                                <div className="meta-value">
                                    {queryTaskDetails?.createdBy?.firstname}{" "}
                                    {queryTaskDetails?.createdBy?.lastname}
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="details" className="tabs">
                            <TabsList
                                variant={"line"}
                                className="justify-start overflow-x-auto overflow-y-none"
                            >
                                <div className="w-fit flex">
                                    <TabsTrigger value="details">
                                        Details
                                    </TabsTrigger>
                                    <TabsTrigger value="comments">
                                        Comments
                                    </TabsTrigger>
                                    <TabsTrigger value="attachments">
                                        Attachments
                                    </TabsTrigger>
                                    <TabsTrigger value="activity">
                                        Activity
                                    </TabsTrigger>
                                </div>
                            </TabsList>
                            <DetailsTaskTab
                                assigneeIds={assigneeIds}
                                columns={columns}
                                handleAddAssignee={handleAddAssignee}
                                handleMoveTask={handleMoveTask}
                                handleRemoveAssignee={handleRemoveAssignee}
                                taskData={queryTaskDetails}
                                setAssigneeIds={setAssigneeIds}
                                isMoveLoading={isMoving}
                            />
                            <TabsContent
                                className="flex flex-col"
                                value="comments"
                            >
                                <div className="comments">
                                    {queryTaskDetails?.comment?.map((com) => {
                                        return (
                                            <div className="comment">
                                                <Avatar size="sm">
                                                    <AvatarImage></AvatarImage>
                                                    <AvatarFallback>
                                                        {
                                                            com.author?.firstname.split(
                                                                "",
                                                            )[0]
                                                        }
                                                        {
                                                            com.author?.lastname.split(
                                                                "",
                                                            )[0]
                                                        }
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="comment-card">
                                                    <div className="comment-header">
                                                        <h2 className="comment-author">
                                                            {
                                                                com.author
                                                                    ?.firstname
                                                            }{" "}
                                                            {
                                                                com.author
                                                                    ?.lastname
                                                            }
                                                        </h2>
                                                        <time className="comment-time">
                                                            {formatterDate(
                                                                com.updatedAt,
                                                            )}
                                                        </time>
                                                    </div>
                                                    <p className="comment-content">
                                                        {com.content}
                                                    </p>
                                                    <div className="comment-actions">
                                                        <button>Edit</button>
                                                        <button>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <form
                                    action=""
                                    onSubmit={handleAddComment}
                                    className="border-t border-t-(--border) mt-4 pt-4 flex gap-4"
                                >
                                    <Avatar className="" size="sm">
                                        <AvatarImage></AvatarImage>
                                        <AvatarFallback>DM</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full flex-1 border rounded-md px-3 py-2 text-sm bg-transparent">
                                        <MentionsInput
                                            value={commentText || ""}
                                            onChange={(_e, newValue) =>
                                                setCommentText(newValue)
                                            }
                                            placeholder="Write a comment… Use @name to mention"
                                            className="w-full outline-none"
                                            style={
                                                mentionsStyle
                                            } /* 👈 Pass the object here */
                                        >
                                            <Mention
                                                trigger="@"
                                                data={mentionData}
                                                markup="@[__display__](__id__)"
                                                displayTransform={(
                                                    _id,
                                                    display,
                                                ) => `@${display}`}
                                                // Optional: You can style the highlighted text inside the input
                                                style={{
                                                    backgroundColor:
                                                        "var(--amber-soft)",
                                                    color: "var(--amber)",
                                                    borderRadius: "3px",
                                                }}
                                            />
                                        </MentionsInput>
                                    </div>
                                    <Button
                                        variant={"defaultYellow"}
                                        className="text-black font-bold cursor-pointer"
                                    >
                                        Post
                                    </Button>
                                </form>
                            </TabsContent>
                            <TabsContent value="attachments">
                                {queryTaskDetails?.attachments?.map(
                                    (attachment) => {
                                        return (
                                            <div
                                                key={attachment.id}
                                                className="attachment-item"
                                            >
                                                <span>
                                                    {attachment.contentType.startsWith(
                                                        "image",
                                                    )
                                                        ? "🖼"
                                                        : "📄"}
                                                </span>
                                                <span>
                                                    {
                                                        attachment.originalFilename
                                                    }
                                                </span>
                                                <span>
                                                    {attachment.fileSize /
                                                        1024 /
                                                        1024 <
                                                    0.1
                                                        ? (
                                                              attachment.fileSize /
                                                              1024
                                                          ).toFixed(2) + "KB"
                                                        : (
                                                              attachment.fileSize /
                                                              1024 /
                                                              1024
                                                          ).toFixed(2) + "MB"}
                                                </span>
                                            </div>
                                        );
                                    },
                                )}
                                <form
                                    action=""
                                    className="form-attachment mt-5"
                                    onSubmit={handleUploadAttachment}
                                >
                                    <Label
                                        htmlFor="file"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`flex flex-col border-2 transition duration-200 rounded-(--radius) p-4 gap-4 cursor-pointer border-dashed
                                ${
                                    isDragging
                                        ? "border-(--amber) bg-(--amber-soft) text-(--amber)"
                                        : "hover:border-(--amber) hover:bg-(--amber-soft) hover:text-(--amber)"
                                }`}
                                    >
                                        {fileName ? (
                                            <div className="font-medium text-center text-(--amber)">
                                                📄{fileName}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-3xl">
                                                    📎
                                                </div>
                                                <div>
                                                    Drop files here or click to
                                                    upload
                                                </div>
                                                <div className="text-(--text-3) text-xs">
                                                    Max 10MB · jpg, png, gif,
                                                    pdf, doc, xlsx, txt, zip
                                                </div>
                                            </>
                                        )}
                                        <Input
                                            ref={fileInputRef}
                                            name="file"
                                            id="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                setFileName(
                                                    e?.target?.value
                                                        .split("\\")
                                                        .at(-1) ?? "",
                                                )
                                            }
                                            type="file"
                                        />
                                    </Label>
                                    <Button
                                        variant={"defaultYellow"}
                                        className="cursor-pointer mx-auto block mt-5"
                                        isLoading={isUploadingAttachment}
                                    >
                                        Upload
                                    </Button>
                                    {isUploadingAttachment && (
                                        <progress
                                            className="w-full"
                                            value={progress}
                                            max={100}
                                        ></progress>
                                    )}
                                </form>
                            </TabsContent>
                            <TabsContent value="activity" className="mt-4">
                                <ActivityTab
                                    activities={queryTaskDetails?.activities}
                                    boardMembers={
                                        queryTaskDetails?.board?.members
                                    }
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </>
            )}
        </div>
    );
};
