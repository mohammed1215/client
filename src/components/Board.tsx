import { formatDistanceToNow } from "date-fns";
export const BoardCard = ({ title, description, updatedAt, visibility }) => {
  return (
    <div className="board-card">
      <div className="card-header">
        {/* title */}
        <div>
          <h2 className="card-title">{title}</h2>
          <div className="card-info">
            <span className="card-visibility">{visibility}</span>
            <span>
              Updated{" "}
              {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        {/* summary */}
        <div className="card-description">{description}</div>
      </div>
      <div className="stats">
        <div className="stats-spec">
          <span className="text-lg text-(--amber) text-center">4</span>
          <span className="text-(--text-3)">Tasks</span>
        </div>
        <div className="stats-spec">
          <span className="text-lg text-(--amber) text-center">4</span>
          <span className="text-(--text-3)">Members</span>
        </div>
        <div className="stats-spec">
          <span className="text-lg text-(--amber) text-center">4</span>
          <span className="text-(--text-3)">Columns</span>
        </div>
      </div>
    </div>
  );
};
