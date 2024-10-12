"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export const UserAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { user: any }
>(({ className, user, ...props }, ref) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAvatarUrl() {
      if (user?.id) {
        const supabase = createClient()
        try {
          // Fetch avatar_url from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.id)
            .single()

          if (profileError) throw profileError

          if (profile?.avatar_url) {
            setAvatarUrl(profile.avatar_url)
          } else {
            // Fallback to storage if no profile avatar_url
            const { data, error } = await supabase
              .storage
              .from('avatars')
              .download(`${user.id}`)

            if (data) {
              const url = URL.createObjectURL(data)
              setAvatarUrl(url)
            } else if (error) {
              console.error("Error downloading avatar:", error)
              // Fallback to user metadata
              if (user.user_metadata?.avatar_url) {
                setAvatarUrl(user.user_metadata.avatar_url)
              }
            }
          }
        } catch (error) {
          console.error("Error fetching avatar:", error)
          // Fallback to user metadata
          if (user.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url)
          }
        }
      }
    }

    fetchAvatarUrl()

    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl)
      }
    }
  }, [user])

  return (
    <Avatar ref={ref} className={cn("h-8 w-8", className)} {...props}>
      {avatarUrl && (
        <AvatarImage 
          src={avatarUrl} 
          alt={user?.user_metadata?.display_name || user?.email || 'User'} 
          className={cn(
            "object-cover",
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "min-w-full min-h-full"
          )}
        />
      )}
      <AvatarFallback>{(user?.user_metadata?.display_name || user?.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
})
UserAvatar.displayName = "UserAvatar"

export { Avatar, AvatarImage, AvatarFallback }
