import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    NotificationFindAllResponse,
    NotificationTypes,
} from "../types/types";
import { formatDistanceToNow } from "date-fns";
import {
    CirclePlus,
    Mail,
    MessageCircle,
    Clock,
    ClockAlert,
    AtSign,
    UserMinus,
    UserCheck,
    type LucideProps,
    Loader,
} from "lucide-react";
import api, { axiosInstance } from "../api/api";
import { getUrl } from "../helpers/helpers";
import { useUser } from "../context/userContext";
const TYPE_META: Record<
    NotificationTypes,
    {
        label: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
        color: string;
    }
> = {
    TASK_ASSIGNED: { label: "Assigned", icon: UserCheck, color: "blue" },
    TASK_UNASSIGNED: { label: "Unassigned", icon: UserMinus, color: "green" },
    USER_MENTIONED: { label: "Mentioned", icon: AtSign, color: "purple" },
    TASK_DUE_SOON: { label: "Due soon", icon: ClockAlert, color: "orange" },
    TASK_OVERDUE: { label: "Overdue", icon: Clock, color: "red" },
    WORKSPACE_INVITATION: {
        label: "Invitation",
        icon: Mail,
        color: "amber",
    },
    WATCHED_TASK_COMMENT: {
        label: "Comment",
        icon: MessageCircle,
        color: "green",
    },
    TASK_CREATED: { label: "New task", icon: CirclePlus, color: "green" },
};

export const NotificationPage = ({
    notifications,
    isGettingNotifications,
}: {
    notifications?: NotificationFindAllResponse[];
    isGettingNotifications: boolean;
}) => {
    const queryClient = useQueryClient();
    const { user, token } = useUser();
    const mutationUpdateReadNotificationStatus = useMutation({
        mutationFn: async (notificationId: string) => {
            const response = await axiosInstance.patch<{ message: string }>(
                getUrl(api.notificationEndpoints.markNotificationRead, {
                    notificationId,
                }),
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            );

            return response.data;
        },
        onSuccess(data, notificationId, onMutateResult, context) {
            queryClient.setQueryData(
                [`get-notifications-${user?.id}`],
                (oldData: NotificationFindAllResponse[]) => {
                    const editedNotificationIndex = oldData.findIndex(
                        (noti) => noti.id === notificationId,
                    );
                    oldData[editedNotificationIndex] = {
                        ...oldData[editedNotificationIndex],
                        isRead: true,
                        readAt: new Date().toString(),
                    };

                    return oldData;
                },
            );
        },
    });

    const handleReadNotifications = (notificationId: string) => {
        mutationUpdateReadNotificationStatus.mutate(notificationId);
    };
    return (
        <div className="w-full min-h-screen ">
            {isGettingNotifications && (
                <div className="w-full h-full flex justify-center items-center">
                    Loading Notifications ...{" "}
                    <Loader className="animate-spin" />
                </div>
            )}
            {!isGettingNotifications &&
                notifications?.map((notification) => {
                    const meta = TYPE_META[notification.type];
                    return (
                        <div
                            key={notification.id}
                            className={` flex gap-5 px-3 py-2  border-l-2 border-b bg-(--surface) ${notification.isRead ? `pointer-events-none  opacity-60` : `hover:bg-(--hover)  cursor-pointer`}`}
                            onClick={() =>
                                handleReadNotifications(notification.id)
                            }
                            style={{
                                borderLeftColor: meta.color,
                            }}
                        >
                            <div
                                className="rounded-full w-2 h-2 mt-3"
                                style={{ backgroundColor: meta.color }}
                            ></div>
                            <div
                                className={`w-9 h-9 content-center text-sm text-center rounded-lg relative `}
                                style={{
                                    backgroundColor: meta.color,
                                }}
                            >
                                {/* Background Layer */}
                                <div
                                    className="absolute inset-0 rounded-lg"
                                    style={{
                                        backgroundColor: meta.color,
                                        filter: "brightness(30%)",
                                    }}
                                />
                                {
                                    <meta.icon
                                        className="mx-auto relative z-10"
                                        style={{ color: meta.color }}
                                    />
                                }
                            </div>
                            <div className="flex-1 py-2 space-y-1">
                                <div className="flex justify-between">
                                    <h2
                                        className="font-semibold"
                                        style={{ color: meta.color }}
                                    >
                                        {notification.title}
                                    </h2>
                                    <span className="text-(--text-4) text-sm">
                                        {formatDistanceToNow(
                                            notification.createdAt,
                                        )}
                                    </span>
                                </div>
                                <p className="text-sm">
                                    {notification.message}
                                </p>
                                <span
                                    className="rounded-full p-2 text-xs relative"
                                    style={{
                                        backgroundColor: meta.color,
                                        color: meta.color,
                                    }}
                                >
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            backgroundColor: meta.color,
                                            filter: "brightness(30%)",
                                        }}
                                    />
                                    <span className="z-10 relative">
                                        {meta.label}
                                    </span>
                                </span>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};
