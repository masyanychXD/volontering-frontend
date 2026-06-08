import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ShowView } from "@/components/refine-ui/views/show-view";
import type { User } from "@/types";

const ProfileShow = () => {
    const navigate = useNavigate();
    const { data: currentUser } = useGetIdentity<User>();

    const getInitials = (name = "") => {
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "";
        if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
        return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
    };

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case "admin": return "Администратор";
            case "coordinator": return "Координатор";
            case "student": return "Волонтер";
            default: return "Неизвестно";
        }
    };

    if (!currentUser) {
        return (
            <ShowView className="class-view">
                <Breadcrumb />
                <p className="text-sm text-muted-foreground">Загрузка...</p>
            </ShowView>
        );
    }

    return (
        <ShowView className="class-view space-y-6">
            <Breadcrumb />
            <h1 className="page-title">Профиль</h1>

            <Card className="class-form-card">
                <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl pb-0 font-bold">
                        Информация о пользователе
                    </CardTitle>
                </CardHeader>

                <Separator />

                <CardContent className="mt-7">
                    <div className="flex flex-col items-center mb-6">
                        <Avatar className="size-24 mb-4">
                            {currentUser.image ? (
                                <AvatarImage src={currentUser.image} alt={currentUser.name} />
                            ) : (
                                <AvatarFallback className="text-2xl">
                                    {getInitials(currentUser.name)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Имя</span>
                            <span className="font-medium">{currentUser.name}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-medium">{currentUser.email}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Роль</span>
                            <Badge>{getRoleLabel(currentUser.role)}</Badge>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() => navigate("/profile/edit")}
                    >
                        Редактировать профиль
                    </Button>
                </CardContent>
            </Card>
        </ShowView>
    );
};

export default ProfileShow;