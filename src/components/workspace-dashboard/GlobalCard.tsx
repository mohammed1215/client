export const GlobalCard = ({
    title,
    children,
    className,
}: {
    title?: string;
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`global-card ${className}`}>
            <h2 className="card-title">{title}</h2>
            <div className="card-content">{children}</div>
        </div>
    );
};
