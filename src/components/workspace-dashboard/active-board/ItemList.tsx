const colorsMap: Record<string, string> = {
    "#6366f1": "before:bg-[#6366f1]",
    "#10b981": "before:bg-[#10b981]",
    "#f59e0b": "before:bg-[#f59e0b]",
    "#ef4444": "before:bg-[#ef4444]",
    "#8b5cf6": "before:bg-[#8b5cf6]",
    "#ec4899": "before:bg-[#ec4899]",
};
export const ItemList = ({
    title,
    type,
    taskCount,
    badgeColor,
    firstBadgeColor,
}: {
    title: string;
    type?: string;
    taskCount: number;
    badgeColor: string;
    firstBadgeColor: string;
}) => {
    return (
        <div
            className={`board-item  ${colorsMap[badgeColor] || "before:bg-[#6366f1]"}`}
        >
            {/*left side of item*/}
            <div className={`item-board-info`}>
                <span>{title}</span>
                <span style={{ color: "var(--text-4)" }}>{type}</span>
            </div>
            {/*right side of item*/}
            <div className="item-task">
                <span
                    className="item-task-line"
                    style={{ backgroundColor: badgeColor }}
                ></span>
                <span
                    style={{
                        fontSize: "15px",
                        color: "var(--text-3)",
                    }}
                >
                    {taskCount} tasks
                </span>
            </div>
        </div>
    );
};
