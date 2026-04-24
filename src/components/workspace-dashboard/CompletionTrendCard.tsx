import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { GlobalCard } from "./GlobalCard";
import { Tooltip } from "../ui/tooltip";
import { transformCompletionTrend } from "@/helpers/helpers";
const mockData = [
    { name: "High", value: 10 },
    { name: "Medium", value: 20 },
    { name: "Low", value: 40 },
    { name: "Urgent", value: 50 },
];
export const CompletionTrendCard = ({
    chartData,
}: {
    chartData: { date: string; count: number }[] | undefined;
}) => {
    const data = chartData ? transformCompletionTrend(chartData) : [];
    console.log(data);
    return (
        <GlobalCard
            title="Completion trend — last 7 days"
            className="completion-trend"
        >
            {data.length ? (
                <div style={{ width: "100%", height: 300, fontSize: "15px" }}>
                    <AreaChart
                        height={300}
                        responsive
                        data={data}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" /> <YAxis />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            fill="#8884d8"
                        />
                    </AreaChart>
                </div>
            ) : (
                <div className="p-4 text-center">No Data Available</div>
            )}
        </GlobalCard>
    );
};
