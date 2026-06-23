import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { axiosInstance, columnEndPoints, taskEndpoints } from "../api/api";
import { getUrl } from "../helpers/helpers";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useUser } from "../context/userContext";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Column, CreateBoardDto } from "../types/types";
export interface ErrorResponse {
    message: string;
}
export const useBoardInfo = () => {
    const { token } = useUser();
    const [errors, setErrors] = useState(null);
    const [active, setActive] = useState("all");
    const { boardId } = useParams();
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const location = useLocation();
    const [addColumnFormOpen, setAddColumnFormOpen] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [activePanel, setActivePanel] = useState(false);
    const queryClient = useQueryClient();
    const [_createdData, setCreatedData] = useState<CreateBoardDto | null>(
        null,
    );
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    // create task
    const mutationCreateTask = useMutation({
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
            toast.success("task has been created successfully", {
                id: "create-board-columns",
            });
            queryClient.invalidateQueries({ queryKey: ["get-board-columns"] });
        },
        onError(error: AxiosError<ErrorResponse>) {
            toast.error(error.response?.data.message, {
                position: "top-center",
                id: "create-board-columns",
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errs: any = {};
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

    const mutationAddCol = useMutation({
        mutationFn: async (data: { name: string }) => {
            toast.loading("adding column...", {
                id: 4,
                position: "top-center",
            });
            const response = await axiosInstance.post(
                getUrl(api.columnEndPoints.getOrCreateColumn, { boardId }),
                data,
            );

            return response.data;
        },
        onSuccess() {
            toast.success("column has been added successfully", {
                id: 4,
                position: "top-center",
            });

            queryClient.refetchQueries({ queryKey: ["get-board-columns"] });
        },
        onError() {
            toast.error("Something went wrong", {
                id: 4,
                position: "top-center",
            });
        },
    });

    const mutationDelCol = useMutation({
        mutationFn: async (columnId: string) => {
            toast.loading("deleting column", { id: 4, position: "top-center" });

            const response = await axiosInstance.delete(
                getUrl(api.columnEndPoints.deleteColumn, { boardId, columnId }),
            );
        },
        onSuccess() {
            toast.success("column  has been deleted successfully", {
                id: 4,
                position: "top-center",
            });

            queryClient.refetchQueries({ queryKey: ["get-board-columns"] });
        },
        onError() {
            toast.error("something went wrong");
        },
    });

    //add new column
    const handleAddColumn = (e: React.SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries()) as { name: string };
        mutationAddCol.mutate(data);
    };

    // delete column
    const handleDeleteColumn = (columnId: string) => {
        mutationDelCol.mutate(columnId);
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(
            formData.entries(),
        ) as unknown as CreateBoardDto;
        if (!data.assigneeIds) {
            delete data.assigneeIds;
        }
        mutationCreateTask.mutate(data);
    };

    // get board columns
    const queryGetBoardColumns = useQuery({
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
        if (queryGetBoardColumns.data && draggedItem !== null) {
            const newItems = [...queryGetBoardColumns.data];
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

    return {
        handleAddColumn,
        handleDeleteColumn,
        handleDragOver,
        handleDragStart,
        handleDrop,
        handleReOrder,
        handleSubmit,
        errors,
        active,
        setActive,
        location,
        addColumnFormOpen,
        setAddColumnFormOpen,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        activePanel,
        setActivePanel,
        selectedTaskId,
        setSelectedTaskId,
        isGettingBoardColumnsInfo: queryGetBoardColumns.isPending,
        BoardColumnsData: queryGetBoardColumns.data,
        isCreatingTask: mutationCreateTask.isPending,
        isDeletingTask: mutationDelCol.isPending,
        isAddingTask: mutationAddCol.isPending,
    };
};
