
export const WorkspaceCard = ({title,description,role,stats})=>{
    return (
        <div className="workspace-card">
            <div className="card-header">
                {/* title */}
                <div>
                    <h2 className="card-title">{title}</h2>
                    <div className="card-info">
                        <span className="card-role">{role}</span>
                        {/* <span></span> */}
                    </div>
                </div>
                {/* description */}
                <p className="card-description">{description}</p>
            </div>
            {/* enrolled people in workspace */}
            <div className="card-enrolled-people">

            </div>
            <div className="stats">
                <div className="stats-spec">
                    <span className="text-lg text-(--amber) text-center">
                        {stats.boards}
                    </span>
                    <span className="text-(--text-3)">Boards</span>
                </div>
                <div className="stats-spec">
                    <span className="text-lg text-(--amber) text-center">
                        4
                    </span>
                    <span className="text-(--text-3)">Tasks</span>
                </div>
                <div className="stats-spec">
                    <span className="text-lg text-(--amber) text-center">
                        {stats.members}
                    </span>
                    <span className="text-(--text-3)">Members</span>
                </div>
            </div>
        </div>
    )
}