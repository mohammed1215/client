export const TaskPriority = ({priority}:{priority:'high'|'medium'|'urgent'|'low'})=>{
    if(priority === 'high'){
        return <span className={`priority-high pill`}>high</span>
    }else if(priority ==='medium'){
        return <span className={`priority-medium pill`}>medium</span>
    }else if(priority === 'urgent'){
        return <span className={`priority-urgent pill`}>urgent</span>
    }else{
        return <span className={`priority-low pill`}>low</span>
    }
}