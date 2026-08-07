"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Fetch the session to determine where to redirect based on role
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/staff");
    }
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Pane - Image & Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Luxury Real Estate"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between w-full h-full">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to website</span>
            </Link>
          </div>
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Empowering your real estate journey with seamless management.
            </h2>
            <p className="text-lg text-primary-200">
              Access the Al-Arz staff portal to manage listings, connect with clients, and close deals efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-primary-50 lg:bg-white relative">
        <div className="w-full max-w-md">
          {/* Mobile Back Button */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-primary-500 hover:text-primary-700 transition-colors mb-8">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to website</span>
          </Link>

          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full overflow-hidden border border-primary-200 bg-white shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Al-Arz Logo"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain p-1"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary-900 mb-2">Welcome Back</h1>
            <p className="text-primary-500 font-medium">Please sign in to your staff account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-primary-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@al-arz.com"
                className="block w-full rounded-xl border border-primary-200 bg-white px-5 py-3.5 text-primary-900 placeholder:text-primary-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 focus:outline-none transition-all shadow-sm"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-primary-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-primary-200 bg-white px-5 py-3.5 pr-12 text-primary-900 placeholder:text-primary-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 focus:outline-none transition-all shadow-sm"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-accent-500 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-xl bg-accent-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-accent-500/30 hover:bg-accent-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-primary-100 text-center">
            <p className="text-sm text-primary-400 font-medium">
              Staff accounts are managed by administrators.<br />
              Need access? Contact HR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
