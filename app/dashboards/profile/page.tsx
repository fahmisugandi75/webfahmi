import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-6 pt-2">Edit Profile</h1>
      <ProfileForm />
    </div>
  )
}