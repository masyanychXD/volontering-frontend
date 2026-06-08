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
import {
  useLink,
  useNotification,
  useRegister,
} from "@refinedev/core";
import { ROLE_OPTIONS } from "@/constants";

export const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("student");

  const { open } = useNotification();

  const Link = useLink();

  const { mutate: register, isPending } = useRegister();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      open?.({
        type: "error",
        message: "Введите имя",
        description: "Имя обязательно для регистрации.",
      });
      return;
    }

    if (password !== confirmPassword) {
      open?.({
        type: "error",
        message: "Пароли не совпадают",
        description: "Пожалуйста, убедитесь, что оба поля пароля содержат одинаковое значение.",
      });
      return;
    }

    register({
      name,
      email,
      password,
      role,
    });
  };

  return (
      <div className="sign-up">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="h-50 w-auto"/>
        </div>

        <Card className="card">
          <CardHeader className="header">
            <CardTitle className="title">
              Регистрация
            </CardTitle>
            <CardDescription className="description">
              Добро пожаловать на платформу волонтерства.
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="content">
            <form onSubmit={handleSignUp} className="form">
              <div className="field">
                <Label htmlFor="name">ФИО</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Иван Иван Иванович"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="ivan@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <Label>Роль</Label>
                <div className="roles">
                  {ROLE_OPTIONS.map((roleOption) => (
                      <button
                          key={roleOption.value}
                          type="button"
                          className={`role-button ${role === roleOption.value ? "is-active" : ""}`}
                          onClick={() => setRole(roleOption.value)}
                      >
                        {roleOption.icon && <roleOption.icon className="h-6 w-6" />}
                        <span>{roleOption.label}</span>
                      </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <Label htmlFor="password">Пароль</Label>
                <InputPassword
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>

              <div className="field">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <InputPassword
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
              </div>

              <Button
                  type="submit"
                  size="lg"
                  className="submit"
                  disabled={isPending}
              >
                {isPending ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </CardContent>

          <Separator />

          <CardFooter className="footer">
            <span>Уже есть аккаунт?</span>
            <Link to="/login">
              Войти
            </Link>
          </CardFooter>
        </Card>
      </div>
  );
};

SignUpForm.displayName = "SignUpForm";
