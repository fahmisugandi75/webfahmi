import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Button } from "@/components/ui/cta-button";
import { GithubIcon } from "lucide-react";

export default function SignUp({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col items-center space-y-2 text-center">
        {/* Logo placeholder with link to homepage */}
        <Link href="/" className="mb-4">
          <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
            LOGO
          </div>
        </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              minLength={6}
              required
            />
          </div>
          <SubmitButton
            className="w-full"
            pendingText="Signing up..."
            formAction={signUpAction}
          >
            Sign up
          </SubmitButton>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="secondary" className="w-full">
          <GithubIcon className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link
            className="text-primary underline-offset-4 hover:underline"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
        <FormMessage message={searchParams} />
        <SmtpMessage />
      </div>
    </div>
  );
}
