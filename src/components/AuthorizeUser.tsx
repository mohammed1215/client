import { axiosInstance, userApiEndPoints } from "@/api/api";
import { useUser } from "@/context/userContext";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

export const AuthorizeUser = () => {
  const { token } = useUser();

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

  if (!token || isError) {
    return <Navigate to="/login" replace />;
  }

  if (isPending) {
    return <Loader2 className="animate-spin" />;
  }
  if (isSuccess) {
    return (
      <DashboardLayout>
        <Outlet />;
      </DashboardLayout>
    );
  }
};
