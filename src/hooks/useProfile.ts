import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { axiosInstance } from "../api/api";
import { toast } from "sonner";
import { useUser } from "../context/userContext";
import { useState } from "react";

type FormDataShape = {
    firstname: string;
    lastname: string;
    bio: string;
};

export const useProfile = () => {
    const queryClient = useQueryClient();
    const { user, login } = useUser();

    const [imageProfile, setImageProfile] = useState<string | null>(
        user?.avatarUrl ?? null,
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const mutationUploadProfileImage = useMutation({
        mutationFn: async (formdata: FormData) => {
            toast.loading("Uploading Image...", { id: "upload-avatar" });
            setProgress(0);

            try {
                const response = await axiosInstance.post(
                    api.userApiEndPoints.uploadAvatar,
                    formdata,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: localStorage.get("token"),
                        },
                        onUploadProgress(p) {
                            if (!p.total) return;
                            setProgress((p.loaded / p.total) * 100);

                            console.log((p.loaded / p.total) * 100);
                        },
                    },
                );

                toast.success("Image uploaded successfully! 🎉", {
                    id: "upload-avatar",
                });
                return response.data;
            } catch (error) {
                toast.error("Upload failed. Please try again.", {
                    id: "upload-avatar",
                });
                throw error;
            }
        },
        onSuccess() {
            // queryClient.invalidateQueries({ queryKey: ["get-user-query"] });
            queryClient.setQueryData(["get-user-query"], () => {
                const token = localStorage.getItem("token");

                const user = localStorage.getItem("user");
                if (token !== null && user !== null)
                    login(token, {
                        ...JSON.parse(user),
                        avatarUrl: imageProfile,
                    });
            });
        },
    });
    const handleUploadImage = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error("Please select an image first");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", selectedFile);

        mutationUploadProfileImage.mutate(formData);
    };

    const mutationUpdateProfile = useMutation({
        mutationFn: async (data: FormDataShape) => {
            toast.loading("Updating the Profile", { id: 5 });
            const response = await axiosInstance.patch(
                api.userApiEndPoints.editProfile,
                data,
            );
            return response.data;
        },
        onSuccess() {
            toast.success("Profile has been updated successfully", { id: 5 });
            queryClient.invalidateQueries({
                queryKey: ["get-user-query"],
            });
        },
        onError() {
            toast.error("Something went wrong");
        },
    });

    const getUserQuery = useQuery({
        queryKey: ["get-user-query"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");
            const data = (
                await axiosInstance.get(api.userApiEndPoints.getMe, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            ).data;
            if (token !== null && user !== null)
                login(token, {
                    ...JSON.parse(user),
                    ...data,
                });
            return data;
        },
        retry: mutationUpdateProfile.isSuccess,
    });

    const handleUpdateProfile = (e: React.SubmitEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries()) as FormDataShape;
        mutationUpdateProfile.mutate(data);
    };

    return {
        handleUpdateProfile,
        isEditing: mutationUpdateProfile.isPending,
        isEdited: mutationUpdateProfile.isSuccess,
        user: getUserQuery.data,
        handleUploadImage,
        isUploadingProfileImage: mutationUploadProfileImage.isPending,
        progress,
        imageProfile,
        setSelectedFile,
        setImageProfile,
    };
};
