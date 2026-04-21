import { GlobalCard } from "./GlobalCard";
import { ActivityItemCard } from "./recent-activity/ActivityItemCard";

interface Activity {
    id: string;
    task: {
        title: string;
        board: {
            name: string;
        };
    };
    activityType: string;
    fieldName: string;
    oldValue: any;
    newValue: any;
    createdAt: string;
}

export const RecentActivityCard = ({
    activities,
}: {
    activities?: Activity[];
}) => {
    if (!activities || activities.length === 0) {
        return (
            <GlobalCard title="Recent activity" className="mt-5">
                <p className="text-muted">No recent activity</p>
            </GlobalCard>
        );
    }

    return (
        <GlobalCard title="Recent activity" className="mt-5">
            <div className="activity-list">
                {activities.slice(0, 8).map((activity) => (
                    <ActivityItemCard
                        key={activity.id}
                        activityType={activity.activityType}
                        fieldName={activity.fieldName}
                        oldValue={activity.oldValue}
                        newValue={activity.newValue}
                        createdAt={activity.createdAt}
                        taskTitle={activity.task.title}
                        boardName={activity.task.board.name}
                    />
                ))}
            </div>
        </GlobalCard>
    );
};
