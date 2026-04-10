import { Bell, CheckCircle2Icon, List, PlusCircle, Timer } from "lucide-react"
import { OuterSectionDashboardLayout } from "../OuterSectionDashboardLayout"
import { CardDashboard } from "../CardDashboard"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { SidebarTrigger } from "../ui/sidebar"
import { useUser } from "@/context/userContext"
import { Link, useLocation } from "react-router-dom"

export const DashboardContentLayout = ()=>{
    const {user} = useUser()
    const location = useLocation()
    console.log(location)
    return (<div className="flex flex-col flex-1 w-full min-h-screen bg-background">
        
        {/* TOP NAVBAR */}
        <header className="flex items-center justify-between h-16 px-4 bg-background border-b border-border">
          <div className="flex items-center gap-4">
            {/* This button automatically toggles the Sidebar! */}
            <SidebarTrigger /> 
            Home
          </div>

          {/* Notifications and Profile */}
          <div className="flex items-center gap-4 text-gray-500">
             {/* Search Input Placeholder */}
             <Link to={'/search'}>
            <Input 
              type="text"
              placeholder="Search tasks..."
              className="hidden md:block text-sm"
              />
              </Link>
            <Button variant={'default'} className="relative cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-700">
              <Bell className=''/>
              {/* Unread Badge */}
              <Badge className='absolute top-0 right-0 w-2 h-2 block' variant={'destructive'}></Badge>
            </Button>
            <Button variant={'defaultYellow'} className='cursor-pointer font-bold'>
                <PlusCircle/> Create Tasks
            </Button>
          </div>
        </header>

        {/* PAGE CONTENT GOES HERE */}
        <main className="flex-1 p-6 overflow-auto bg-primary">
          <div className="bg-background rounded-lg shadow p-6 h-full border border-border">
            <div className='flex justify-between items-center'>  
              <div>
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="text-secondary-foreground">Welcome back, {user.firstname}! Here's what's happening today.</p>
              </div>
              
            </div>

            <div className='grid grid-cols-3 gap-6 mt-8'>
              <CardDashboard Icon={List} iconStyles=' bg-[#1a2a44] w-14 h-16 text-[#137eeb] px-1 pt-2 pb-6' className='' label='Task Numbers' numbers={'155'}/>
              <CardDashboard Icon={Timer} iconStyles=' bg-[#2d272c] w-14 h-16 text-[#f97316] px-1 pt-2 pb-6' className='' label='Task Numbers' numbers={'235'}/>
              <CardDashboard Icon={CheckCircle2Icon} iconStyles=' bg-[#262443] w-14 h-16 text-[#a855f7] px-1 pt-2 pb-6' className='' label='Task Numbers' numbers={'535'}/>
            </div>

            {/* active workspaces */}
            <OuterSectionDashboardLayout viewAll={true} linkTo={'/workspaces'} text={'Active Workspaces'}>
              WorkspaceSection
            </OuterSectionDashboardLayout>
          </div>
        </main>
      </div>)
}