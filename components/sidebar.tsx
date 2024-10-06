"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MainNav } from "@/components/main-nav"
import { Home, BarChart2, Users, Settings, Image, FileText, FilePen, NotebookText, UserCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'

const sidebarNavItems = [
  {
    title: "Home",
    href: "/dashboards/home",
    icon: Home,
  },
  {
    title: "Pages",
    href: "/dashboards/pages",
    icon: NotebookText,
  },
  {
    title: "Posts",
    href: "/dashboards/posts",
    icon: FilePen,
  },
  {
    title: "Media",
    href: "/dashboards/media",
    icon: Image,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "hidden md:flex md:flex-col h-screen sticky top-0 border-r",
      "bg-gray-900 dark:bg-black",
      "text-white dark:text-white",
      className
    )}>
      <div className="flex-grow overflow-y-auto">
        <div className="px-3 py-2">
          {/* Logo placeholder */}
          <div className="flex items-center mb-10 px-4 pt-7">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">Logo</span>
            </div>
          </div>
          <h2 className="mb-2 px-4 text-sm font-light tracking-tight text-gray-500 dark:text-gray-400">
            Dashboard
          </h2>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white dark:text-gray-300 hover:text-white hover:bg-gray-500 dark:hover:text-white dark:hover:bg-gray-800",
                  pathname === item.href && "bg-gray-600 text-white hover:text-white hover:bg-gray-500 dark:bg-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-600"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-gray-700 dark:border-gray-800 bg-gray-900 dark:bg-black px-3 py-4">
        <h2 className="mb-2 px-4 text-sm font-light tracking-tight text-gray-500 dark:text-gray-400">
          Settings
        </h2>
        <div className="space-y-1">
          <Link href="/dashboards/profile" className="w-full">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white dark:text-gray-300 hover:text-white hover:bg-gray-500 dark:hover:text-white dark:hover:bg-gray-800",
                pathname === "/dashboards/profile" && "bg-gray-600 text-white hover:text-white hover:bg-gray-500 dark:bg-gray-500 dark:text-white dark:hover:text-white dark:hover:bg-gray-600"
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}