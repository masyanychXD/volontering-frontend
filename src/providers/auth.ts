import type { AuthProvider } from "@refinedev/core";
import { User, SignUpPayload } from "@/types";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
    register: async ({
                         email,
                         password,
                         name,
                         role,
                         image,
                         imageCldPubId,
                     }: SignUpPayload) => {
        try {
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
                image,
                role,
                imageCldPubId,
            } as SignUpPayload);

            if (error) {
                return {
                    success: false,
                    error: {
                        name: "Ошибка регистрации",
                        message:
                            error?.message || "Не удалось создать аккаунт. Попробуйте снова.",
                    },
                };
            }

            localStorage.setItem("user", JSON.stringify(data.user));

            return {
                success: true,
                redirectTo: "/profile",
            };
        } catch (error) {
            console.error("Register error:", error);
            return {
                success: false,
                error: {
                    name: "Ошибка регистрации",
                    message: "Не удалось создать аккаунт. Попробуйте снова.",
                },
            };
        }
    },
    login: async ({ email, password }) => {
        try {
            const { data, error } = await authClient.signIn.email({
                email: email,
                password: password,
            });

            if (error) {
                console.error("Login error from auth client:", error);
                return {
                    success: false,
                    error: {
                        name: "Ошибка входа",
                        message: error?.message || "Попробуйте позже.",
                    },
                };
            }

            localStorage.setItem("user", JSON.stringify(data.user));

            // Принудительно перезагружаем страницу для обновления роли
            setTimeout(() => {
                window.location.href = "/profile";
            }, 50);

            return {
                success: true,
                redirectTo: "/profile",
            };
        } catch (error) {
            console.error("Login exception:", error);
            return {
                success: false,
                error: {
                    name: "Ошибка входа",
                    message: "Попробуйте позже.",
                },
            };
        }
    },
    logout: async () => {
        const { error } = await authClient.signOut();

        if (error) {
            console.error("Logout error:", error);
            return {
                success: false,
                error: {
                    name: "Ошибка выхода",
                    message: "Не удалось выйти. Попробуйте снова.",
                },
            };
        }

        localStorage.removeItem("user");

        return {
            success: true,
            redirectTo: "/login",
        };
    },
    onError: async (error) => {
        if (error.response?.status === 401) {
            return {
                logout: true,
            };
        }

        return { error };
    },
    check: async () => {
        const user = localStorage.getItem("user");

        if (user) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: "/login",
            error: {
                name: "Не авторизован",
                message: "Проверка не пройдена",
            },
        };
    },
    getPermissions: async () => {
        const user = localStorage.getItem("user");

        if (!user) return null;
        const parsedUser: User = JSON.parse(user);

        return {
            role: parsedUser.role,
        };
    },
    getIdentity: async () => {
        const user = localStorage.getItem("user");

        if (!user) return null;
        const parsedUser: User = JSON.parse(user);

        return {
            id: parsedUser.id,
            name: parsedUser.name,
            email: parsedUser.email,
            image: parsedUser.image,
            role: parsedUser.role,
            imageCldPubId: parsedUser.imageCldPubId,
        };
    },
};