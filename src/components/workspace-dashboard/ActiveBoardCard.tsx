import type { dashboardResponse } from "@/pages/Board";
import { ItemList } from "./active-board/ItemList";
import { GlobalCard } from "./GlobalCard";

const colors = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
];

export const ActiveBoardCard = ({
    activeBoardData,
}: {
    activeBoardData: dashboardResponse["mostActiveBoards"];
}) => {
    return (
        <GlobalCard className="active-boards" title="Most active boards">
            {activeBoardData &&
                activeBoardData.length &&
                activeBoardData.map((boardData, index) => {
                    const chosenColor = colors[index % colors.length];
                    return (
                        <ItemList
                            key={boardData.boardId}
                            title={boardData.boardName}
                            badgeColor={chosenColor}
                            taskCount={boardData.taskCount}

                            // firstBadgeColor={colorsMap[chosenColor] || "before:bg-[#6366f1]"}
                        />
                    );
                })}
        </GlobalCard>
    );
};
