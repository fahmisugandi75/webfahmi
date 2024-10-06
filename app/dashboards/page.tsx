import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("User not found, redirecting to /sign-in");
    return redirect("/sign-in");
  }

  console.log("User found, redirecting to /dashboard/home");
  // Redirect to the dashboard home page
  return redirect("/dashboards/home");
}
