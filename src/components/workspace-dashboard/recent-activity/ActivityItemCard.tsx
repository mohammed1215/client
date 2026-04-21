// ActivityItemCard.tsx
import { formatDistanceToNow } from "date-fns";

type ActivityType = "created" | "moved" | "assigned" | "completed" | "updated";

interface ActivityProps {
    activityType: ActivityType;
    fieldName: string;
    oldValue: any;
    newValue: any;
    createdAt: string;
    taskTitle?: string;
    boardName?: string;
}

export const ActivityItemCard = ({
    activityType,
    fieldName,
    oldValue,
    newValue,
    createdAt,
    taskTitle,
    boardName,
}: ActivityProps) => {
    const getActivityColor = (type: ActivityType) => {
        const colors = {
            created: "#3B82F6",
            moved: "#F59E0B",
            assigned: "#A78BFA",
            completed: "#22C55E",
            updated: "#6B7280",
        };
        return colors[type] || colors.updated;
    };

    const getActivityMessage = () => {
        switch (activityType) {
            case "created":
                return (
                    <>
                        created task{" "}
                        <strong>{taskTitle || newValue?.title}</strong>
                        {boardName && <> in {boardName}</>}
                    </>
                );

            case "moved":
                return (
                    <>
                        moved <strong>{taskTitle || oldValue?.task}</strong>{" "}
                        from <strong>{oldValue?.oldColumn}</strong> to{" "}
                        <strong>{newValue?.newColumn}</strong>
                    </>
                );

            case "assigned":
                const assigneeCount = newValue?.assignedUserIds?.length || 0;
                return (
                    <>
                        assigned {assigneeCount}{" "}
                        {assigneeCount === 1 ? "person" : "people"} to
                        <strong>{taskTitle}</strong>
                    </>
                );

            case "completed":
                return (
                    <>
                        completed <strong>{taskTitle}</strong>
                    </>
                );

            default:
                return (
                    <>
                        updated <strong>{fieldName}</strong>
                    </>
                );
        }
    };

    const timeAgo = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
    });

    return (
        <div className="activity-item">
            <div
                className="activity-dot"
                style={{ backgroundColor: getActivityColor(activityType) }}
            />
            <div className="activity-content">
                <p className="activity-text">{getActivityMessage()}</p>
                <span className="activity-time">{timeAgo}</span>
            </div>
        </div>
    );
};
