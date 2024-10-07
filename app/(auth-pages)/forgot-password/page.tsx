import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full sm:w-[400px]">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email to reset your password
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
              />
            </div>
            <SubmitButton
              className="w-full"
              pendingText="Sending reset link..."
              formAction={forgotPasswordAction}
            >
              Reset Password
            </SubmitButton>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Remember your password?{" "}
            <Link
              className="text-primary underline-offset-4 hover:underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
          <FormMessage message={searchParams} />
          <SmtpMessage />
        </CardFooter>
      </Card>
    </div>
  );
}
