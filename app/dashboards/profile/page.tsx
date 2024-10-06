import { ProfileForm } from "@/components/profile-form"
import AccountSettings from "@/components/account-setting"

export default function ProfilePage() {
  return (
    <div className="mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-6 pt-2">Edit Profile</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <ProfileForm />
        </div>
        <div className="lg:w-1/3">
          <AccountSettings />
        </div>
      </div>
    </div>
  )
}