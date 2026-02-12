import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Loader2 } from "lucide-react";
import { useLogin, useRegister, useUser } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { api } from "@shared/routes";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AuthPage() {
  const [search] = useSearch();
  const [activeTab, setActiveTab] = useState("login");
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();
  const { user } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) setLocation("/dashboard");
  }, [user, setLocation]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("tab") === "register") setActiveTab("register");
  }, [search]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "", fullName: "", location: "", role: "farmer" },
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Decorative */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-55197c2841d9?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <Sprout className="w-8 h-8" />
            <span className="font-display font-bold text-2xl">AgroSoil AI</span>
          </div>
          <h2 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
            Cultivate the future <br/> with precision.
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Join thousands of farmers using AI to make smarter decisions about crops, soil health, and market timing.
          </p>
        </div>
        <div className="relative z-10 text-primary-foreground/60 text-sm">
          © 2024 AgroSoil AI Inc.
        </div>
      </div>

      {/* Right: Forms */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8">
             <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <Sprout className="w-8 h-8" />
                <span className="font-display font-bold text-2xl">AgroSoil AI</span>
              </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 rounded-xl bg-muted p-1">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="login">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-2xl">Welcome back</CardTitle>
                      <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit((data) => login(data))} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter username" {...field} className="h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full h-11 rounded-xl text-base mt-2" 
                            disabled={isLoginPending}
                          >
                            {isLoginPending ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : "Sign In"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="register">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-2xl">Create an account</CardTitle>
                      <CardDescription>Get started with your free account today.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit((data) => register(data))} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} className="h-11 rounded-xl bg-muted/50 border-0" value={field.value || ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Punjab, India" {...field} className="h-11 rounded-xl bg-muted/50 border-0" value={field.value || ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="farmer_john" {...field} className="h-11 rounded-xl bg-muted/50 border-0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-xl bg-muted/50 border-0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full h-11 rounded-xl text-base mt-2" 
                            disabled={isRegisterPending}
                          >
                            {isRegisterPending ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : "Create Account"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
