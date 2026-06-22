import type { AxiosError } from "axios";
import { useLocation, useParams, type ErrorResponse } from "react-router-dom";
import { toast } from "sonner";
import { getUrl } from "../helpers/helpers";
import { axiosInstance, boardEndPoints, workspaceEndPoints } from "../api/api";
import type { Board, CreateBoardDto } from "../pages/BoardInfo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { dashboardResponse } from "../pages/Board";
import { useEffect, useState } from "react";
import { useSocket } from "../context/useSocket";
import { useUser } from "../context/userContext";

export const useBoards = () => {
    const location = useLocation();
    const { token } = useUser();
    const { workspaceId } = useParams();
    const { joinWorkspaceRoom } = useSocket();
    const queryClient = useQueryClient();

    const [errors, setErrors] = useState<Record<string, string> | null>(null);
    const [activeFilter, setActiveFilter] = useState("all");

    // socket
    useEffect(() => {
        if (workspaceId) {
            joinWorkspaceRoom(workspaceId);
        }
    }, [workspaceId, joinWorkspaceRoom]);

    // Query: Get Workspace Dashboard Statistics
    const dashboardQuery = useQuery({
        queryKey: [`get-dashboard-${workspaceId}`],
        queryFn: async () => {
            const response = await axiosInstance.get<dashboardResponse>(
                getUrl(workspaceEndPoints.getWorkspaceDashboard, {
                    workspaceId,
                }),
                { headers: { Authorization: `Bearer ${token}` } },
            );
            return response.data;
        },
        enabled: !!workspaceId,
    });

    // Query: Get All Workspace Boards
    const boardsQuery = useQuery({
        queryKey: ["get-boards", workspaceId],
        queryFn: async () => {
            const response = await axiosInstance.get<Board[]>(
                getUrl(boardEndPoints.getOrCreateBoards, { workspaceId }),
                { headers: { Authorization: `Bearer ${token}` } },
            );
            return response.data;
        },
        enabled: !!workspaceId,
    });

    // Mutation: Create a New Board
    const createBoardMutation = useMutation({
        mutationKey: ["create-board"],
        mutationFn: async (formData: CreateBoardDto) => {
            const response = await axiosInstance.post(
                getUrl(boardEndPoints.getOrCreateBoards, { workspaceId }),
                formData,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            return response.data;
        },
        onSuccess() {
            toast.success("Board has been created successfully", {
                id: "create-board",
            });
            setErrors(null);
            queryClient.invalidateQueries({
                queryKey: ["get-boards", workspaceId],
            });
        },
        onError(error: AxiosError<ErrorResponse>) {
            toast.error(error?.response?.data?.message || "An error occurred", {
                position: "top-center",
                id: "create-board",
            });

            // Map server messages to field error states
            const serverMessage = error.response?.data.message;
            if (serverMessage && Array.isArray(serverMessage)) {
                const errs: Record<string, string> = {};
                for (const err of serverMessage) {
                    if (typeof err === "string") {
                        const fieldName = err.split(" ")[0];
                        errs[fieldName] = err;
                    }
                }
                setErrors(errs);
            }
        },
    });

    // Form Submission Handler
    const handleCreateBoard = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(
            formData.entries(),
        ) as unknown as CreateBoardDto;
        createBoardMutation.mutate(data);
    };

    return {
        workspaceId,
        location,
        errors,
        activeFilter,
        setActiveFilter,
        dashboard: dashboardQuery.data,
        isDashboardLoading: dashboardQuery.isLoading,
        isDashboardSuccess: dashboardQuery.isSuccess,
        boards: boardsQuery.data,
        isBoardsPending: boardsQuery.isPending,
        isBoardsSuccess: boardsQuery.isSuccess,
        isCreatePending: createBoardMutation.isPending,
        handleCreateBoard,
    };
};
