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

  // Fetch the fullname from the Profiles table
  const { data: profileData, error } = await supabase
    .from('Profiles')
    .select('fullname')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
  }

  const fullName = profileData?.fullname || 'Guest'

  return (
    <div className="flex min-h-screen">
      <Sidebar className="flex-shrink-0" />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-background border-b">
          <div className="flex h-16 items-center px-8">
            <Search />
            <div className="ml-auto flex items-center space-x-4">
              <p className="text-sm font-medium">Welcome, {fullName}!</p>
              <ModeToggle />
              <UserNav user={user} />
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}