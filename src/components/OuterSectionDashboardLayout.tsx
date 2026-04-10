import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

export const OuterSectionDashboardLayout = ({children,text,viewAll,linkTo})=>{
    return <>
    <div className="flex justify-between items-center my-5">
        <h2 className="text-2xl font-bold">{text}</h2>
        {viewAll && <Button variant={"link"} className="text-blue-600 font-bold">
            <Link to={linkTo}>View All</Link>
            <ArrowRight/>
        </Button>}
    </div>
    <div>
        {children}
    </div>
    </>
}