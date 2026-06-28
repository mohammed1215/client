import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    attahcmentEndPoints,
    axiosInstance,
    commentsEndpoints,
    taskEndpoints,
} from "../api/api";
import { getUrl } from "../helpers/helpers";
import { useMemo, useRef, useState } from "react";
import type {
    CreateCommentDto,
    CreateCommentResponse,
    MoveTaskRequest,
    Task,
    UploadAttachmentResponse,
} from "../types/types";
import { useUser } from "../context/userContext";
import { toast } from "sonner";

export const useTaskSlider = (taskId: string | null) => {
    const [assigneeIds, setAssigneeIds] = useState<any>([]);
    const [commentText, setCommentText] = useState("");
    const [progress, setProgress] = useState(0);
    const { token } = useUser();
    const queryClient = useQueryClient();
    const queryTaskDetails = useQuery({
        queryKey: ["task-details", taskId],
        queryFn: async () => {
            try {
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
            } catch (error) {
                toast.error("something went wrong in getting task details");
                throw error;
            }
        },
        enabled: !!taskId,
    });
    const mentionData = useMemo(() => {
        return (
            queryTaskDetails.data?.board?.members?.map((member) => ({
                id: member.user.id,
                display: `${member.user.firstname} ${member.user.lastname}`,
            })) || []
        );
    }, [queryTaskDetails]);

    const mutation = useMutation({
        mutationKey: ["add-assignee"],
        mutationFn: async (formData: object) => {
            const response = await axiosInstance.post<{ message: string }>(
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
        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: ["task-details", taskId],
            });
        },
    });
    const mutation2 = useMutation({
        mutationKey: ["remove-assignee"],
        mutationFn: async (formData: { userToUnassignId: string }) => {
            const response = await axiosInstance.delete<{ message: string }>(
                getUrl(taskEndpoints.removeAssigneeFromTask, {
                    taskId,
                    userId: formData.userToUnassignId,
                }),
                {
                    data: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: ["task-details", taskId],
            });
        },
    });

    function handleAddAssignee(updatedIds: string[]) {
        mutation.mutate({ assigneeIds: updatedIds });
    }

    function handleRemoveAssignee(userToUnassignId: string) {
        mutation2.mutate({ userToUnassignId });
    }

    const mutationMove = useMutation({
        mutationKey: ["move-task"],
        mutationFn: async (formData: object) => {
            const response = await axiosInstance.patch<{ message: string }>(
                getUrl(taskEndpoints.moveTask, { taskId }),
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: ["get-board-columns"],
            });
        },
    });

    function handleMoveTask(e: React.SubmitEvent) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(
            formData.entries(),
        ) as unknown as MoveTaskRequest;
        if (typeof data.position === "string") {
            data.position = parseInt(data.position);
        }
        mutationMove.mutate(data);
    }
    const mutation5 = useMutation({
        mutationKey: ["post-comment"],
        mutationFn: async (formData: CreateCommentDto) => {
            const response = await axiosInstance.post<CreateCommentResponse>(
                getUrl(commentsEndpoints.getOrPostComments, { taskId }),
                formData,
            );
            return response.data;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: ["task-details", taskId],
            });
        },
    });
    // 1️⃣ State to track if a file is hovering over the dropzone
    const [isDragging, setIsDragging] = useState(false);
    // 2️⃣ Ref to access the hidden input element
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    function handleDragOver(e: React.DragEvent) {
        e.preventDefault(); // Prevents the browser from opening the file
        setIsDragging(true);
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e: React.DragEvent) {
        // 👈 استبدلنا any بالنوع الصحيح لحدث السحب
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (fileInputRef.current) {
                fileInputRef.current.files = e.dataTransfer.files;

                const droppedFile: File = e.dataTransfer.files[0]; // 👈 الملف نوعه File
                setFileName(droppedFile.name); // 👈 الاسم نوعه string
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

    const mutationUploadAttachment = useMutation({
        mutationKey: ["upload-attachment"],
        mutationFn: async (formData: FormData) => {
            const response = await axiosInstance.post<UploadAttachmentResponse>(
                getUrl(attahcmentEndPoints.getOrUploadAttachment, { taskId }),
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    onUploadProgress(progressEvent) {
                        if (progressEvent.progress) {
                            setProgress(progressEvent.progress * 100);
                        }
                    },
                },
            );
            return response.data;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ["task-details"] });
        },
    });

    function handleUploadAttachment(e: React.SubmitEvent) {
        e.preventDefault();
        const formData = new FormData(e.target);
        setProgress(0);
        mutationUploadAttachment.mutate(formData);
    }

    return {
        handleAddAssignee,
        handleAddComment,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleMoveTask,
        handleRemoveAssignee,
        handleUploadAttachment,
        queryTaskDetails: queryTaskDetails?.data,
        isGettingTaskDetails: queryTaskDetails.isPending,
        assigneeIds,
        isDragging,
        fileName,
        fileInputRef,
        setAssigneeIds,
        isMoving: mutationMove.isPending,
        commentText,
        setCommentText,
        mentionData,
        setFileName,
        isUploadingAttachment: mutationUploadAttachment.isPending,
        progress,
    };
};
