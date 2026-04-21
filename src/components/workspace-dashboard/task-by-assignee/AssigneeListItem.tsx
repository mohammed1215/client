import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AssigneeListItem = ({
    firstname = "hello",
    lastname = "welcome",
    avatarUrl,
    taskCount = 5,
    percentageOfAllTasks = "90%",
}: {
    firstname: string;
    lastname: string;
    avatarUrl: string | null;
    taskCount: number;
    percentageOfAllTasks: string;
}) => {
    return (
        <div className="task-assignee-item justify-between flex items-center gap-4">
            {/*left side of item*/}
            <Avatar>
                <AvatarImage src={avatarUrl ?? undefined} alt="" />
                <AvatarFallback>
                    {firstname?.charAt(0) + lastname?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <span className="min-w-20 text-sm font-semibold">
                {firstname} {lastname?.trim()?.charAt(0)}.
            </span>
            {/*right side of item*/}

            <span className="task-assignee-line relative">
                <span
                    className={`task-assignee-line-fill absolute w-full h-full rounded-full`}
                    style={{
                        width: percentageOfAllTasks,
                    }}
                ></span>
            </span>
            <span
                style={{
                    fontSize: "15px",
                    color: "var(--text-3)",
                }}
                className="min-w-[24px] text-center"
            >
                {taskCount}
            </span>
        </div>
    );
};
