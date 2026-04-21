import { AssigneeListItem } from "./task-by-assignee/AssigneeListItem";
import { GlobalCard } from "./GlobalCard";
import type { dashboardResponse } from "@/pages/Board";

export const TaskByAssigneeCard = ({
    tasksByAssignee,
    totalTasks,
}: {
    tasksByAssignee: dashboardResponse["tasksByAssignee"];
    totalTasks: number;
}) => {
    return (
        <GlobalCard className="tasks-by-assignee" title="Tasks by assignee">
            {tasksByAssignee.map((task) => {
                return (
                    <AssigneeListItem
                        firstname={task.firstname}
                        lastname={task.lastname}
                        taskCount={task.count}
                        avatarUrl={task.avatarUrl}
                        percentageOfAllTasks={`${(task.count / totalTasks) * 100}%`}
                    />
                );
            })}
        </GlobalCard>
    );
};
