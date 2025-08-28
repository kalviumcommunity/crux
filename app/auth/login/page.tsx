import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-xl">C</span>
            </div>
            <span className="text-foreground font-bold text-2xl">CruX</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
        </div>

        <LoginForm />

        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-accent hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
