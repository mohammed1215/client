import { InfoCard } from "./workspace-dashboard/InfoCard";
import { PriorityCard } from "./workspace-dashboard/PriorityCard";
import { CompletionTrendCard } from "./workspace-dashboard/CompletionTrendCard";
import type { dashboardResponse } from "@/pages/Board";
import { ActiveBoardCard } from "./workspace-dashboard/ActiveBoardCard";
import { TaskByAssigneeCard } from "./workspace-dashboard/TaskByAssigneeCard";
import { RecentActivityCard } from "./workspace-dashboard/RecentActivityCard";

export const WorkspaceDashboard = ({
    chartData,
    completedTrendChartData,
    totalTasks = 0,
    completedTasks = 0,
    overdueTasks = 0,
    activeBoardData,
    tasksByAssignee,
    recentActivity,
}: {
    chartData?: Record<string, number>;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completedTrendChartData?: { date: string; count: number }[];
    activeBoardData: dashboardResponse["mostActiveBoards"];
    tasksByAssignee: dashboardResponse["tasksByAssignee"];
    recentActivity: dashboardResponse["recentActivity"];
}) => {
    return (
        <div className="workspace-dashboard">
            <h2 className="mb-2.5">Workspace Dashboard</h2>
            {/* info */}
            <div className="info">
                {/*total*/}
                <InfoCard
                    count={totalTasks}
                    title="total task"
                    message="across all boards"
                    kind="total"
                />
                {/*completed*/}
                <InfoCard
                    count={completedTasks}
                    title="Completed"
                    message="completed tasks"
                    kind="completed"
                />
                {/*overdue*/}
                <InfoCard
                    count={overdueTasks}
                    title="Overdue"
                    message="overdue tasks"
                    kind="overdue"
                />
                {/*in progress*/}
                <InfoCard
                    count={50}
                    title="In progress"
                    message="remaining tasks"
                    kind="in-progress"
                />
            </div>
            {/* second section */}
            <div className="second-section flex-col lg:flex-row mt-5 flex gap-5">
                {/* Priority Breakdown */}
                <PriorityCard chartData={chartData} />

                {/* Completion Trend */}
                <CompletionTrendCard chartData={completedTrendChartData} />
            </div>
            {/* third section */}
            <div className="third-section flex-col lg:flex-row mt-5 flex gap-5">
                {/* Active Boards */}
                <ActiveBoardCard activeBoardData={activeBoardData} />
                {/* Tasks by assignee */}
                <TaskByAssigneeCard
                    totalTasks={totalTasks}
                    tasksByAssignee={tasksByAssignee}
                />
            </div>
            {/* Recent activity */}
            <RecentActivityCard activities={recentActivity} />
        </div>
    );
};
