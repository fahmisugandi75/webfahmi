import { Sidebar } from "@/components/sidebar"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { createClient } from "@/utils/supabase/server"
import { Toaster } from "@/components/ui/toaster"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <Sidebar className="w-full md:w-64 shrink-0" />
      <div className="flex-1 w-full flex flex-col">
        <header className="border-b">
          <div className="flex h-16 items-center px-8">
            <Search />
            <div className="ml-auto flex items-center space-x-4">
              <p className="text-sm font-medium">Welcome, {user.user_metadata?.display_name || 'Guest'}!</p>
              <ModeToggle />
              <UserNav user={user} />
            </div>
          </div>
        </header>
        <main className="flex-1 w-full p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}