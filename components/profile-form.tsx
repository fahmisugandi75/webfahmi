'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export function ProfileForm() {
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null)
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setEmail(user.email || '')

        // Fetch profile data from the Profiles table
        const { data: profileData, error } = await supabase
          .from('Profiles')
          .select('fullname, bio, website, avatar_url')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
        } else if (profileData) {
          setFullName(profileData.fullname || '')
          setBio(profileData.bio || '')
          setWebsite(profileData.website || '')
          setAvatarUrl(profileData.avatar_url || '')
        }
      }
    }
    getUser()
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const tempUrl = URL.createObjectURL(file)
      setTempAvatarUrl(tempUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    
    try {
      let newAvatarUrl = avatarUrl

      if (selectedFile) {
        // Generate a unique file name
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`

        // Upload the file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, selectedFile, { upsert: true })

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        // Get the public URL of the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        newAvatarUrl = publicUrl
      }

      // Update profile in the Profiles table
      const { error: profileError } = await supabase
        .from('Profiles')
        .upsert({ 
          id: user?.id, 
          fullname: fullName,
          bio, 
          website, 
          avatar_url: newAvatarUrl 
        })

      if (profileError) {
        throw new Error(`Profile update failed: ${profileError.message}`)
      }

      // Update local state
      setAvatarUrl(newAvatarUrl)
      setSelectedFile(null)
      setTempAvatarUrl(null)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      router.refresh()
    } catch (error) {
      console.error('Error in profile update process:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="flex gap-8 max-w-3xl">
      <div className="flex-shrink-0">
        <div className="relative w-48 h-48 group">
          <Avatar className="h-48 w-48 overflow-hidden">
            <AvatarImage 
              src={tempAvatarUrl || avatarUrl} 
              alt={fullName || email || 'User'} 
              className={cn(
                "object-cover",
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                "min-w-full min-h-full"
              )}
            />
            <AvatarFallback>{(fullName || email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Edit className="text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-gray-100 cursor-not-allowed"
            placeholder="Enter email"
          />
          <p className="text-xs text-gray-400 mt-2">You can only change your email address via Account settings.</p>
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            className="h-32"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </div>
  )
}