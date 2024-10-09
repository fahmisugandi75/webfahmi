import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
// Add these imports
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
// Add this import
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Logo } from '@/components/logo';

export default function Login({ searchParams }: { searchParams: { message?: string } }) 

{
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full sm:w-[400px]">
        <CardHeader>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/">
              <Logo />
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Login with your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={signInAction} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                required
              />
            </div>
            <SubmitButton
              className="w-full"
              pendingText="Signing In..."
            >
              Sign in
            </SubmitButton>
          </form>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6">
            <GithubIcon className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
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
            Don't have an account?{" "}
            <Link
              className="text-primary underline-offset-4 hover:underline"
              href="/sign-up"
            >
              Sign up
            </Link>
          </p>
          {searchParams.message && <FormMessage message={searchParams.message} />}
        </CardFooter>
      </Card>
    </div>
  );
}
