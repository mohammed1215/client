
import { Label } from "./ui/label"

export const CardDashboard = ({className,Icon,label,iconStyles,numbers,...props}:{className?:string,label:string,iconStyles:string,numbers:string,Icon:any})=>{
    return <div className={`bg-card p-4 rounded-xl border-border flex flex-col gap-3 `} {...props}>
        {Icon&&<Icon className={`rounded-lg ${iconStyles}`}/>}
        <Label className="text-primary-foreground text-lg">
            {label}
        </Label>
        <span className="font-bold text-2xl">
            {numbers}
        </span>
    </div>
}