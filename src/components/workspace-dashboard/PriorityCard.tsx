// import { Tooltip } from "../ui/tooltip";
import { useEffect } from "react";
import { GlobalCard } from "./GlobalCard";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { transformPriority } from "@/helpers/helpers";

const COLORS = {
    high: "#F97316",
    medium: "#3B82F6",
    low: "#22C55E",
    urgent: "#EF4444",
};
export const PriorityCard = ({
    chartData,
}: {
    chartData?: Record<string, number>;
}) => {
    // Transform once, outside JSX
    const data = chartData ? transformPriority(chartData) : [];
    const hasData = data.length > 0 && data.some((d) => d.value > 0);
    return (
        <div>
            <GlobalCard
                title="Priority breakdown"
                className={"priority-breakdown"}
            >
                {hasData ? (
                    <PieChart width={300} height={300} className="mx-auto">
                        <Pie
                            data={data}
                            dataKey={"value"}
                            nameKey={"name"}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                        >
                            {data.map((entry) => (
                                <Cell
                                    key={entry.name}
                                    fill={
                                        COLORS[
                                            entry.name as keyof typeof COLORS
                                        ]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                    </PieChart>
                ) : (
                    <p>No Chart Data</p>
                )}
            </GlobalCard>
        </div>
    );
};
