import { useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { authApiEndPoints, axiosInstance } from "../api/api";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

export const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const location = useLocation();
    const mutation = useMutation({
        mutationKey: ["verify-email"],
        mutationFn: async () => {
            const response = await axiosInstance.post(
                authApiEndPoints.verifyEmail + location.search,
            );
            return response.data;
        },
        onSuccess() {
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        },
    });

    if (!searchParams.get("token") || !searchParams.get("id")) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center max-w-md w-full">
                    <div className="text-red-500">
                        <p className="text-lg font-semibold">
                            Invalid Verification Url
                        </p>
                        <Button
                            onClick={() => navigate("/login")}
                            className="mt-4 cursor-pointer hover:scale-105 hover:border-white border-2"
                        >
                            Go to Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    useEffect(() => {
        mutation.mutate();
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center max-w-md w-full">
                {mutation.isPending && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="mt-4 text-gray-700 dark:text-gray-300">
                            Verifying your email...
                        </p>
                    </div>
                )}

                {mutation.isError && (
                    <div className="text-red-500">
                        <p className="text-lg font-semibold">
                            Verification Failed
                        </p>
                        <p className="mt-2">
                            {mutation.error instanceof Error
                                ? mutation.error.message
                                : "Failed to verify email."}
                        </p>
                        <Button
                            onClick={() => navigate("/login")}
                            className="mt-4 cursor-pointer"
                        >
                            Go to Login
                        </Button>
                    </div>
                )}

                {mutation.isSuccess && (
                    <div className="text-green-500">
                        <p className="text-lg font-semibold">Email Verified!</p>
                        <p className="mt-2">
                            Your email has been successfully verified! You will
                            be redirected to the login page shortly.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
