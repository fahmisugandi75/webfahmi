"use client"

import { cn } from "@/lib/utils"
import { Home, BarChart2, Users, Settings, Image, FileText, FilePen, NotebookText, UserCircle, LogOut, Briefcase } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Logo } from "@/components/logo"
import { useRouter } from 'next/navigation';
import { signOutAction } from "@/app/actions";

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
  {
    title: "Projects",
    href: "/dashboards/projects",
    icon: Briefcase,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={cn(
      "sticky top-0 bg-gray-900 overflow-y-auto",
      "w-64 h-screen", // Fixed width and full viewport height
      className
    )}>
      <div className="flex flex-col min-h-full">
        <div className="flex-shrink-0 px-8 py-8">
          <Logo />
        </div>
        <nav className="flex-grow px-6 pb-4">
          <ul role="list" className="space-y-3">
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
        </nav>
        <div className="flex-shrink-0 px-6 py-4 mt-auto">
          <ul role="list" className="space-y-3">
            <li>
              <Link
                href="/dashboards/profile"
                className={cn(
                  pathname === "/dashboards/profile"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                )}
              >
                <UserCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
                Profile
              </Link>
            </li>
            <li>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className={cn(
                    "text-gray-400 hover:text-white hover:bg-gray-800",
                    "group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  )}
                >
                  <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                  Logout
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}