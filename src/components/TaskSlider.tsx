import {
  attahcmentEndPoints,
  axiosInstance,
  commentsEndpoints,
  taskEndpoints,
} from "@/api/api";
import { useUser } from "@/context/userContext";
import { formatterDate, getUrl } from "@/helpers/helpers";
import type { Column, CreateCommentDto, Task } from "@/pages/BoardInfo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { MentionsInput, Mention } from "react-mentions";
import { ActivityTab } from "./ActivityTab";
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
  setActivePanel: any;
  activePanel: boolean;
  columns?: Column[] | null;
}) => {
  const [assigneeIds, setAssigneeIds] = useState<any>([]);
  const [commentText, setCommentText] = useState("");
  const { token } = useUser();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["task-details", taskId],
    queryFn: async () => {
      const response = await axiosInstance.get<Task>(
        getUrl(taskEndpoints.getTaskInfo, { taskId }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const assigneeIds = response.data?.assignedTasks?.map(
        (assigneeTask) => assigneeTask.user.id,
      );
      setAssigneeIds(assigneeIds);

      return response.data;
    },
    enabled: !!taskId,
  });
  const mentionData =
    query.data?.board?.members?.map((member) => ({
      id: member.user.id, // The ID you want to send to your backend
      display: `${member.user.firstname} ${member.user.lastname}`, // The name shown in the dropdown
    })) || [];
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["task-details",taskId] });
  // }, [taskId]);

  const mutation = useMutation({
    mutationKey: ["add-assignee"],
    mutationFn: async (formData: object) => {
      const response = await axiosInstance.post(
        getUrl(taskEndpoints.AddAssigneesToTask, { taskId }),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["task-details", taskId] });
    },
  });
  const mutation2 = useMutation({
    mutationKey: ["remove-assignee"],
    mutationFn: async (formData: object) => {
      const response = await axiosInstance.post(
        getUrl(taskEndpoints.removeAssigneeFromTask, { taskId }),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["task-details", taskId] });
    },
  });
  function handleAddAssignee(updatedIds: string[]) {
    mutation.mutate({ assigneeIds: updatedIds });
  }

  function handleRemoveAssignee(userToUnassignId: string) {
    mutation2.mutate({ userToUnassignId });
  }

  const mutation3 = useMutation({
    mutationKey: ["move-task"],
    mutationFn: async (formData: object) => {
      const response = await axiosInstance.patch(
        getUrl(taskEndpoints.moveTask, { taskId }),
        formData,
      );
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["get-board-columns"] });
    },
  });

  function handleMoveTask(e: React.SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries()) as any;
    data.position = parseInt(data.position);
    mutation3.mutate(data);
  }
  const mutation5 = useMutation({
    mutationKey: ["post-comment"],
    mutationFn: async (formData: CreateCommentDto) => {
      const response = await axiosInstance.post(
        getUrl(commentsEndpoints.getOrPostComments, { taskId }),
        formData,
      );
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["task-details", taskId] });
    },
  });
  // 1️⃣ State to track if a file is hovering over the dropzone
  const [isDragging, setIsDragging] = useState(false);
  // 2️⃣ Ref to access the hidden input element
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  function handleDragOver(e: any) {
    e.preventDefault(); // Prevents the browser from opening the file
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: any) {
    e.preventDefault();
    setIsDragging(false);

    // 3️⃣ Grab the dropped files and assign them to the hidden input
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        setFileName(e.dataTransfer.files[0].name); // Update the state!
      }
    }
  }

  function handleAddComment(e: React.SubmitEvent) {
    e.preventDefault();

    // Regex to extract the IDs from the markup: @[Display Name](user-id)
    const idRegex = /@\[.*?\]\((.*?)\)/g;
    const extractedIds: string[] = [];
    let match;
    while ((match = idRegex.exec(commentText)) !== null) {
      extractedIds.push(match[1]); // match[1] is the user ID inside the parenthesis
    }

    // Clean the text to send normal readable text to the backend (removes brackets)
    const cleanContent = commentText.replace(/@\[(.*?)\]\((.*?)\)/g, "@$1");

    // Send the exact format your NestJS DTO expects
    mutation5.mutate({
      content: cleanContent,
      mentionedUserIds: [...new Set(extractedIds)],
    });

    // Clear input after submission
    setCommentText("");
  }

  const mutation4 = useMutation({
    mutationKey: ["upload-attachment"],
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post(
        getUrl(attahcmentEndPoints.getOrUploadAttachment, { taskId }),
        formData,
      );
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["task-details"] });
    },
  });

  function handleUploadAttachment(e: React.SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target);
    mutation4.mutate(formData);
  }

  return (
    <div className={`detail-panel ${activePanel ? "active" : ""}`}>
      {query.isPending ? (
        <div className="justify-center flex w-full items-center h-100vh">
          <Loader2 className="animate-spin" /> Loading
        </div>
      ) : (
        <>
          {/* detail header */}
          <div className="detail-header">
            <div className="detail-header-left">
              <h2 className="task-number">{query.data?.taskNumber}</h2>
              <span className="priority">{query.data?.priority}</span>
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
            <h2 className="task-title">{query.data?.title}</h2>
            <div className="detail-meta-grid">
              <div className="meta-item">
                <div className="meta-label">Status</div>
                {/* <div className="meta-value">{query.data.column}</div> */}
              </div>
              <div className="meta-item">
                <div className="meta-label">Priority</div>
                <div className="meta-value">{query.data?.priority}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Due Date</div>
                <div className="meta-value text-(--orange)">
                  {format(query.data?.dueDate!, "MMM dd, yyyy")}
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-label">EST. Hours</div>
                <div className="meta-value">{query.data?.estimatedHours}h</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Column</div>
                <div className="meta-value">{query.data?.column?.name}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Created By</div>
                <div className="meta-value">
                  {query.data?.createdBy?.firstname}{" "}
                  {query.data?.createdBy?.lastname}
                </div>
              </div>
            </div>

            <Tabs defaultValue="details" className="tabs">
              <TabsList variant={"line"} className="justify-start">
                <div className="w-fit">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </div>
              </TabsList>
              <TabsContent value="details">
                {/* description */}
                <div>
                  <h3 className="detail-section-hdr">DESCRIPTION</h3>
                  <p className="details-description">
                    {query.data?.description}
                  </p>
                </div>
                <div className="assignees mt-4">
                  <div className="assignees-header">
                    <h3 className="detail-section-hdr">Assignees</h3>
                    <Dialog>
                      <DialogTrigger>+ Add</DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Assign Members</DialogTitle>
                        {/* people inside the board */}
                        <div className="assign-list">
                          {query.data?.board?.members.map((member) => {
                            // let checked = false;
                            // if (assigneeIds) {
                            //   for (const assigneeId of assigneeIds) {
                            //     if (assigneeId === member.user.id) {
                            //       checked = true;
                            //       break;
                            //     }
                            //   }
                            // }
                            return (
                              <div key={member.id} className="assign-item">
                                <div className="flex items-center gap-4">
                                  <Avatar className="dark:border-2 dark:border-(--amber)">
                                    <AvatarImage></AvatarImage>
                                    <AvatarFallback className="dark:bg-(--amber-soft)! dark:text-(--amber) text-sm font-bold">
                                      DM
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="text-sm">
                                      {member.user.firstname}{" "}
                                      {member.user.lastname}
                                    </h4>
                                    <p className="text-xs text-(--text-3)">
                                      {member.user.email}
                                    </p>
                                  </div>
                                </div>
                                <Checkbox
                                  onClick={(_e) => {
                                    const index = assigneeIds.indexOf(
                                      member.user.id,
                                    );
                                    let ids = [...assigneeIds];
                                    if (index !== -1) {
                                      ids.splice(index, 1);
                                      setAssigneeIds(ids);
                                      handleRemoveAssignee(member.user.id);
                                    } else {
                                      let newIds = [
                                        ...assigneeIds,
                                        member.user.id,
                                      ];
                                      setAssigneeIds(newIds);
                                      handleAddAssignee(newIds);
                                    }
                                  }}
                                  checked={assigneeIds.includes(member.user.id)}
                                  className=" border-2 border-(--border2)"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="mt-4">
                    {query.data?.assignedTasks?.map((assignee) => (
                      <div key={assignee.id} className="assign-item">
                        <div className="flex items-center gap-4">
                          <Avatar className="dark:border-2 dark:border-(--amber)">
                            <AvatarImage></AvatarImage>
                            <AvatarFallback className="dark:bg-(--amber-soft)! dark:text-(--amber) text-sm font-bold">
                              DM
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-sm">
                              {assignee.user.firstname} {assignee.user.lastname}
                            </h4>
                            <p className="text-xs text-(--text-3)">
                              {assignee.user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="detail-section-hdr">Move Task</h3>
                  <div>
                    <form
                      action=""
                      className="flex gap-2"
                      onSubmit={handleMoveTask}
                    >
                      <Select
                        name="columnId"
                        defaultValue={query.data?.column?.id}
                      >
                        <SelectTrigger
                          id="columnId"
                          className="w-full bg-(--deep)!"
                        >
                          <SelectValue
                            placeholder="Select a column"
                            className="placeholder:text-(--text-3)!"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {columns?.map((column: Column) => {
                            return (
                              <SelectItem key={column.id} value={column.id}>
                                {column.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <Input
                        name="position"
                        type="number"
                        min={0}
                        defaultValue={1}
                      />
                      <Button className="dark:border-(--border2)! cursor-pointer">
                        Move
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>
              <TabsContent className="flex flex-col" value="comments">
                <div className="comments">
                  {query.data?.comment?.map((com) => {
                    return (
                      <div className="comment">
                        <Avatar size="sm">
                          <AvatarImage></AvatarImage>
                          <AvatarFallback>
                            {com.author?.firstname.split("")[0]}
                            {com.author?.lastname.split("")[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="comment-card">
                          <div className="comment-header">
                            <h2 className="comment-author">
                              {com.author?.firstname} {com.author?.lastname}
                            </h2>
                            <time className="comment-time">
                              {formatterDate(com.updatedAt)}
                            </time>
                          </div>
                          <p className="comment-content">{com.content}</p>
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
                      onChange={(_e, newValue) => setCommentText(newValue)}
                      placeholder="Write a comment… Use @name to mention"
                      className="w-full outline-none"
                      style={mentionsStyle} /* 👈 Pass the object here */
                    >
                      <Mention
                        trigger="@"
                        data={mentionData}
                        markup="@[__display__](__id__)"
                        displayTransform={(_id, display) => `@${display}`}
                        // Optional: You can style the highlighted text inside the input
                        style={{
                          backgroundColor: "var(--amber-soft)",
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
                {query.data?.attachments?.map((attachment) => {
                  return (
                    <div key={attachment.id} className="attachment-item">
                      <span>
                        {attachment.contentType.startsWith("image")
                          ? "🖼"
                          : "📄"}
                      </span>
                      <span>{attachment.originalFilename}</span>
                      <span>
                        {attachment.fileSize / 1024 / 1024 < 0.1
                          ? (attachment.fileSize / 1024).toFixed(2) + "KB"
                          : (attachment.fileSize / 1024 / 1024).toFixed(2) +
                            "MB"}
                      </span>
                    </div>
                  );
                })}
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
                        <div className="text-3xl">📎</div>
                        <div>Drop files here or click to upload</div>
                        <div className="text-(--text-3) text-xs">
                          Max 10MB · jpg, png, gif, pdf, doc, xlsx, txt, zip
                        </div>
                      </>
                    )}
                    <Input
                      ref={fileInputRef}
                      name="file"
                      id="file"
                      className="hidden"
                      type="file"
                    />
                  </Label>
                  <Button
                    variant={"defaultYellow"}
                    className="cursor-pointer mx-auto block mt-5"
                  >
                    Upload
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="activity" className="mt-4">
                <ActivityTab
                  activities={query.data?.activities}
                  boardMembers={query.data?.board?.members}
                />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};
