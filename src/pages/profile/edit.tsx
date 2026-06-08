import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetIdentity, useUpdate } from "@refinedev/core";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ShowView } from "@/components/refine-ui/views/show-view";
import UploadWidget from "@/components/upload-widget";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types";

const profileSchema = z.object({
    name: z.string().min(2, "Имя должно быть не менее 2 символов"),
    email: z.string().email("Неверный email адрес"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileEdit = () => {
    const navigate = useNavigate();
    const { data: currentUser, refetch: refetchUser } = useGetIdentity<User>();
    const { mutate: updateUser, mutation } = useUpdate();

    const [image, setImage] = useState<string | null>(null);
    const [imageCldPubId, setImageCldPubId] = useState<string>("");

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: currentUser?.name ?? "",
            email: currentUser?.email ?? "",
        },
    });

    const { handleSubmit, control, reset } = form;

    useEffect(() => {
        if (currentUser) {
            reset({
                name: currentUser.name,
                email: currentUser.email,
            });
            setImage(currentUser.image ?? null);
            setImageCldPubId(currentUser.imageCldPubId ?? "");
        }
    }, [currentUser, reset]);

    const onSubmit = async (values: ProfileFormValues) => {
        if (!currentUser?.id) return;

        updateUser(
            {
                resource: "users",
                id: currentUser.id,
                values: {
                    ...values,
                    image,
                    imageCldPubId,
                },
            },
            {
                onSuccess: () => {
                    refetchUser();
                    navigate("/");
                },
            }
        );
    };

    const getInitials = (name = "") => {
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "";
        if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
        return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
    };

    return (
        <ShowView className="class-view space-y-6">
            <Breadcrumb />
            <h1 className="page-title">Редактировать профиль</h1>

            <Card className="class-form-card">
                <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl pb-0 font-bold">
                        Изменить информацию
                    </CardTitle>
                </CardHeader>

                <Separator />

                <CardContent className="mt-7">
                    <div className="flex flex-col items-center mb-6">
                        <Avatar className="size-24 mb-4">
                            {image ? (
                                <AvatarImage src={image} alt={currentUser?.name} />
                            ) : (
                                <AvatarFallback className="text-2xl">
                                    {getInitials(currentUser?.name ?? "")}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>

                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-3">
                                <Label>Фото профиля</Label>
                                <UploadWidget
                                    value={image ? { url: image, publicId: imageCldPubId } : null}
                                    onChange={(file) => {
                                        if (file) {
                                            setImage(file.url);
                                            setImageCldPubId(file.publicId);
                                        } else {
                                            setImage(null);
                                            setImageCldPubId("");
                                        }
                                    }}
                                />
                            </div>

                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Имя</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Иван Петров" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ivan@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="flex-1"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? "Сохранение..." : "Сохранить"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate("/")}
                                >
                                    Отмена
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </ShowView>
    );
};

export default ProfileEdit;