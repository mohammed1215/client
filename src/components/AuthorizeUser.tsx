import { axiosInstance, userApiEndPoints } from "@/api/api";
import { useUser } from "@/context/userContext";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { useEffect } from "react";

export const AuthorizeUser = () => {
    const { token } = useUser();
    const navigate = useNavigate();
    const { isPending, isError, isSuccess } = useQuery({
        queryKey: ["authUser", token],
        queryFn: () => {
            return axiosInstance.get(userApiEndPoints.getMe, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        enabled: !!token,
        retry: false,
    });

    useEffect(() => {
        function handleAuthUnautorized() {
            navigate("/login");
        }

        window.addEventListener("auth-unauthorized", () => {
            handleAuthUnautorized();
        });
        return () =>
            window.removeEventListener(
                "auth-unauthorized",
                handleAuthUnautorized,
            );
    }, [navigate]);

    if (!token || isError) {
        return <Navigate to="/login" replace />;
    }

    if (isPending) {
        return <Loader2 className="animate-spin" />;
    }

    if (isSuccess) {
        return (
            <DashboardLayout>
                <Outlet />
            </DashboardLayout>
        );
    }
};
