import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

import { Textarea } from "@/components/ui/textarea";
import { useBack, useList } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import { sessionSchema } from "@/lib/schema";
import UploadWidget from "@/components/upload-widget";
import { Event, User } from "@/types";
import z from "zod";

const SessionsCreate = () => {
    const back = useBack();

    const form = useForm({
        resolver: zodResolver(sessionSchema),
        refineCoreProps: {
            resource: "sessions",
            action: "create",
        },
        defaultValues: {
            status: "Открыто",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting, errors },
        control,
    } = form;

    const bannerPublicId = form.watch("bannerCldPubId");

    const onSubmit = async (values: z.infer<typeof sessionSchema>) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Ошибка создания сессии:", error);
        }
    };

    // Fetch events list
    const { query: eventsQuery } = useList<Event>({
        resource: "events",
        pagination: {
            pageSize: 100,
        },
    });

    // Fetch coordinators list
    const { query: coordinatorsQuery } = useList<User>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "coordinator",
            },
        ],
        pagination: {
            pageSize: 100,
        },
    });

    const coordinators = coordinatorsQuery.data?.data || [];
    const coordinatorsLoading = coordinatorsQuery.isLoading;

    const events = eventsQuery.data?.data || [];
    const eventsLoading = eventsQuery.isLoading;

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Создать сессию</h1>
            <div className="intro-row">
                <p>Укажите необходимую информацию для создания волонтерской сессии.</p>
                <Button onClick={() => back()}>Назад</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Заполните форму
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={control}
                                    name="bannerUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Баннер <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <UploadWidget
                                                    value={
                                                        field.value
                                                            ? {
                                                                url: field.value,
                                                                publicId: bannerPublicId ?? "",
                                                            }
                                                            : null
                                                    }
                                                    onChange={(file) => {
                                                        if (file) {
                                                            field.onChange(file.url);
                                                            form.setValue("bannerCldPubId", file.publicId, {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            });
                                                        } else {
                                                            field.onChange("");
                                                            form.setValue("bannerCldPubId", "", {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            {errors.bannerCldPubId && !errors.bannerUrl && (
                                                <p className="text-destructive text-sm">
                                                    {errors.bannerCldPubId.message?.toString()}
                                                </p>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Название сессии <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Утренняя смена - Субботник в парке"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="eventId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Мероприятие <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(Number(value))
                                                    }
                                                    value={field.value?.toString()}
                                                    disabled={eventsLoading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Выберите мероприятие" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {events.map((event) => (
                                                            <SelectItem
                                                                key={event.id}
                                                                value={event.id.toString()}
                                                            >
                                                                {event.name} ({event.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="coordinatorId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Координатор <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={coordinatorsLoading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Выберите координатора" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {coordinators.map((coordinator) => (
                                                            <SelectItem
                                                                key={coordinator.id}
                                                                value={coordinator.id}
                                                            >
                                                                {coordinator.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="capacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Количество мест <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder="30"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value ? Number(value) : undefined);
                                                        }}
                                                        value={(field.value as number | undefined) ?? ""}
                                                        name={field.name}
                                                        ref={field.ref}
                                                        onBlur={field.onBlur}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Статус <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Выберите статус" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Открыто">Открыта</SelectItem>
                                                        <SelectItem value="Закрыто">Закрыта</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Описание <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Краткое описание сессии"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                <Button type="submit" size="lg" className="w-full">
                                    {isSubmitting ? (
                                        <div className="flex gap-1">
                                            <span>Создание сессии...</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        "Создать сессию"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default SessionsCreate;