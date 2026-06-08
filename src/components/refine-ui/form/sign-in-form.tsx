"use client";

import { useState } from "react";

import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLink, useLogin, useRefineOptions } from "@refinedev/core";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Link = useLink();

  const { title } = useRefineOptions();

  const { mutate: login } = useLogin();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      email,
      password,
    });
  };

  return (
      <div
          className={cn(
              "flex",
              "flex-col",
              "items-center",
              "justify-center",
              "px-6",
              "py-8",
              "min-h-svh"
          )}
      >
        <div className={cn("flex", "items-center", "justify-center")}>
          <img src="/logo.png" alt="ДоброЦентр" className="h-50 w-auto" />
        </div>

        <Card className={cn("sm:w-[456px]", "p-12", "mt-6")}>
          <CardHeader className={cn("px-0")}>
            <CardTitle
                className={cn(
                    "text-blue-600",
                    "dark:text-blue-400",
                    "text-3xl",
                    "font-semibold"
                )}
            >
              Вход
            </CardTitle>
            <CardDescription
                className={cn("text-muted-foreground", "font-medium")}
            >
              С возвращением
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className={cn("px-0")}>
            <form onSubmit={handleSignIn}>
              <div className={cn("flex", "flex-col", "gap-2")}>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder=""
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div
                  className={cn("relative", "flex", "flex-col", "gap-2", "mt-6")}
              >
                <Label htmlFor="password">Пароль</Label>
                <InputPassword
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>

              <Button type="submit" size="lg" className={cn("w-full", "mt-6")}>
                Войти
              </Button>
            </form>
          </CardContent>

          <Separator />

          <CardFooter>
            <div className={cn("w-full", "text-center text-sm")}>
            <span className={cn("text-sm", "text-muted-foreground")}>
              Нет аккаунта?{" "}
            </span>
              <Link
                  to="/register"
                  className={cn(
                      "text-green-600",
                      "dark:text-green-400",
                      "font-semibold",
                      "underline"
                  )}
              >
                Зарегистрироваться
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
  );
};

SignInForm.displayName = "SignInForm";