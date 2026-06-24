import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import api, { axiosInstance, columnEndPoints } from "../api/api";
import { getUrl } from "../helpers/helpers";
import { useParams } from "react-router-dom";
import type { Column } from "../types/types";
import { useUser } from "../context/userContext";
import { AxiosError } from "axios";
export const useColumnsDialog = (
    queryGetBoardColumns: Column[] | undefined,
) => {
    const [addColumnFormOpen, setAddColumnFormOpen] = useState(false);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const queryClient = useQueryClient();
    const { boardId } = useParams();
    const { token } = useUser();

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
        onError(error: AxiosError) {
            if (error?.response?.data) {
                const errData = error?.response?.data as { message?: string };
                console.log(errData?.message);
                toast.error(errData.message ?? "something went wrong");
            }
        },
    });

    //add new column
    const handleAddColumn = (e: React.SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries()) as { name: string };
        mutationAddCol.mutate(data);
    };

    function handleDragStart(index: number) {
        setDraggedItem(index);
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function handleDrop(index: number) {
        // Check for null specifically, as 0 is a valid index but falsy
        if (queryGetBoardColumns && draggedItem !== null) {
            const newItems = [...queryGetBoardColumns];
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
    // delete column
    const handleDeleteColumn = (columnId: string) => {
        mutationDelCol.mutate(columnId);
    };

    function handleReOrder(e: React.SubmitEvent) {
        e.preventDefault();
        console.log("reorderring");
    }

    return {
        addColumnFormOpen,
        handleAddColumn,
        handleDeleteColumn,
        handleDragOver,
        handleDragStart,
        handleDrop,
        handleReOrder,
        setAddColumnFormOpen,
        isDeletingTask: mutationDelCol.isPending,
        isAddingTask: mutationAddCol.isPending,
    };
};
