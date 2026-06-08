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
                        message: error?.message || "Не удалось создать аккаунт.",
                    },
                };
            }

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
                    message: "Не удалось создать аккаунт.",
                },
            };
        }
    },
    login: async ({ email, password }) => {
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                return {
                    success: false,
                    error: {
                        name: "Ошибка входа",
                        message: error?.message || "Попробуйте позже.",
                    },
                };
            }

            setTimeout(() => {
                window.location.href = "/profile";
            }, 50);

            return {
                success: true,
                redirectTo: "/profile",
            };
        } catch (error) {
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
            return {
                success: false,
                error: {
                    name: "Ошибка выхода",
                    message: "Не удалось выйти.",
                },
            };
        }

        return {
            success: true,
            redirectTo: "/login",
        };
    },
    onError: async (error) => {
        if (error.response?.status === 401) {
            return { logout: true };
        }
        return { error };
    },
    check: async () => {
        try {
            const { data } = await authClient.getSession();

            if (data?.user) {
                // Кэшируем в localStorage для быстрого доступа
                const userData = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    role: (data.user as any).role,
                    image: (data.user as any).image,
                    imageCldPubId: (data.user as any).imageCldPubId,
                };
                localStorage.setItem("user", JSON.stringify(userData));
                return { authenticated: true };
            }

            localStorage.removeItem("user");
            return {
                authenticated: false,
                logout: true,
                redirectTo: "/login",
            };
        } catch {
            localStorage.removeItem("user");
            return {
                authenticated: false,
                logout: true,
                redirectTo: "/login",
            };
        }
    },
    getPermissions: async () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        return { role: JSON.parse(userStr).role };
    },
    getIdentity: async () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        const user = JSON.parse(userStr);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            imageCldPubId: user.imageCldPubId,
        };
    },
};