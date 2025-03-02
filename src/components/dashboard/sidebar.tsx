"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  CalendarDays, 
  LayoutDashboard, 
  Settings, 
  LogOut 
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Timeline",
    icon: CalendarDays,
    href: "/dashboard/timeline",
    color: "text-violet-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ 
      redirect: false 
    })
    router.push("/login")
  }

  return (
    <div className="space-y-4 py-4 flex flex-col bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 logoAndicon">
          <img src="/favicon.ico" alt="TimeScape" className="h-10 w-10" />
          <h1 className="text-2xl font-bold ml-2">TimeScape</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? 
                  "bg-gradient-to-r from-indigo-400/50 to-sky-700/50 text-white" : 
                  "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-auto">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:bg-white/10 hover:text-white p-3"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
} 