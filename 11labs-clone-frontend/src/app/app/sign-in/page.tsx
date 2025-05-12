"use client";

import { Button } from "~/components/ui/button";
import type { SignInFormValues } from "~/schemas/auth";
import { signInSchema } from "~/schemas/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import Image from "next/image";
import Navbar from "~/components/landing-page/navbar";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!signInResult?.error) {
        router.push("/app/speech-synthesis/text-to-speech");
      } else {
        setError(
          signInResult.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "Something went wrong",
        );
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-full">
        {/*Left side*/}
        <div className="relative w-full lg:w-1/2">
          {/*Logo*/}
          <div className="absolute top-6 left-8">
            <span className="text-xl font-bold tracking-tight text-black">
              11LabsCLone
            </span>
          </div>

          {/* Centered sign up form */}
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-8">
              <h2 className="mb-6 text-center text-2xl font-semibold">
                Log in to your Account
              </h2>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}
              {/*Form*/}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your email address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>Enter your password</FormDescription>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="mr-2 h-4 w-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      {"Don't"} have an account?{" "}
                      <a
                        className="font-medium text-black underline"
                        href="/app/sign-up"
                      >
                        Sign up
                      </a>
                    </span>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/*Right side*/}
        <div className="hidden py-[3vh] pr-[3vh] lg:block lg:w-1/2">
          <div className="hidden h-full rounded-3xl bg-gradient-to-b from-indigo-100 via-purple-100 to-[#5960d7] lg:block">
            <div className="flex h-full flex-col p-12">
              <div className="flex h-full items-center justify-center">
                <Image
                  src="/assets/placeholder.png"
                  alt="Dashboard preview"
                  width={800}
                  height={450}
                  className="rounded-lg object-cover"
                />
              </div>

              <div className="h-fit w-full max-w-lg">
                <div className="bg-opacity-40 mb-3 flex w-fit rounded-2xl bg-indigo-100 px-3 py-1">
                  <span className="text-xs font-medium tracking-wider text-black uppercase">
                    Latest updates
                  </span>
                </div>
                <h3 className="text-lg text-white xl:text-xl 2xl:text-2xl 2xl:leading-10">
                  Use the text-to-speech editor to create voiceovers in multiple
                  voices using AI.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
