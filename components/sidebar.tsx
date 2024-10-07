"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, BarChart2, Users, Settings, Image, FileText, FilePen, NotebookText, UserCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Logo } from "@/components/logo"

const sidebarNavItems = [
  {
    title: "Dashboard",
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
      "flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-8 pb-4",
      "max-w-[300px] w-full", // Added max-width and full width
      className
    )}>
      <div className="flex space-y-4 py-8">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-3">
              {sidebarNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="/dashboards/profile"
              className={cn(
                pathname === "/dashboards/profile"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                "group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
              )}
            >
              <UserCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}