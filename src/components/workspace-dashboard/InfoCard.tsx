type infoCard = "total" | "completed" | "overdue" | "in-progress";
export const InfoCard = ({
    title,
    count,
    message,
    kind = "in-progress",
}: {
    title: string;
    count: string | number;
    message?: string;
    kind: infoCard;
}) => {
    return (
        <div className={`info-card ${kind}-card`}>
            <h3
                style={{
                    fontSize: "15px",
                    color: `${kind === "total" ? "var(--amber-dim);" : kind === "overdue" ? "#f14949" : "white"}`,
                    fontWeight: "500",
                }}
            >
                {title}
            </h3>
            <span
                style={{
                    fontWeight: "600",
                    color: `${kind === "total" ? "var(--amber)" : kind === "overdue" ? "var(--red)" : "white"}`,
                }}
            >
                {count}
            </span>
            {message && (
                <p
                    style={{
                        fontSize: "15px",
                        fontWeight: "600",
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};
