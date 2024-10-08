"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/ui/avatar"  // Make sure this import is correct
import { useState, useEffect } from "react"

export function UserNav({ user }: { user: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fullName, setFullName] = useState<string>('')

  useEffect(() => {
    async function fetchFullName() {
      if (user?.id) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('Profiles')
          .select('fullname')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching fullname:', error)
        } else if (data) {
          setFullName(data.fullname || '')
        }
      }
    }

    fetchFullName()
  }, [user])

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/") // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error)
      alert("Failed to log out. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName || 'Guest'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'guest@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => router.push('/dashboards/profile')}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} disabled={isLoading}>
          {isLoading ? "Logging out..." : "Log out"}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}