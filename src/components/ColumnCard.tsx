import { format } from "date-fns";
import type { Task } from "../types/types";

export const ColumnCard = ({
    title,
    tasks,
    setSelectedTask,
    setActivePanel,
    setIsCreateTaskOpen,
}: {
    title: string;
    tasks: Array<Task>;
    setSelectedTask: (selectedTask: string) => void;
    activePanel?: boolean;
    setActivePanel: (activePanel: boolean) => void;
    setIsCreateTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <div className="column">
            {/* column header */}
            <div className="col-header">
                <h2 className="column-title">{title}</h2>
            </div>
            {/* tasks */}

            <div className="col-body">
                {tasks.map((task) => {
                    return (
                        <div
                            onClick={() => {
                                setSelectedTask(task.id);
                                setActivePanel(true);
                            }}
                            key={task.id}
                            className="task-card"
                        >
                            <span className="task-num">{task.taskNumber}</span>
                            <h3 className="task-title">{task.title}</h3>
                            {/* TODO: task tags */}
                            <div className="task-tags"></div>
                            {/* task footer */}
                            <div className="task-foot">
                                <div className="priority">{task.priority}</div>
                                <div className="due-date">
                                    {format(task.dueDate as string, "MMM d")}
                                </div>
                                <div className="avatars"></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                className="col-button"
                onClick={() => setIsCreateTaskOpen(true)}
            >
                New Task
            </button>
        </div>
    );
};
