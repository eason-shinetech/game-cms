"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
const LoginPage = () => {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await signIn("credentials", {
        ...values,
        redirect: false,
        callbackUrl: "/admin",
      });
      console.log("response:", res);
      if (res?.error) {
        throw new Error(res.error);
      }
      if (res?.url) {
        router.push(res.url);
      }
      toast.success("Login Success!");
    } catch (error: any) {
      console.error("Login Fail:", error);
      toast.error("Login Fail!");
    }
  };
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>CMS Admin Manage System</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="enter your email"
                        {...field}
                      />
                    </FormControl>
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
                        disabled={isSubmitting}
                        placeholder="enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                  )}
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
