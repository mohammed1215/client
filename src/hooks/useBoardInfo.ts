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
    const location = useLocation();

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

    return {
        handleSubmit,
        errors,
        active,
        setActive,
        location,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        activePanel,
        setActivePanel,
        selectedTaskId,
        setSelectedTaskId,
        isGettingBoardColumnsInfo: queryGetBoardColumns.isPending,
        BoardColumnsData: queryGetBoardColumns.data,
        isCreatingTask: mutationCreateTask.isPending,
    };
};
