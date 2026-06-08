import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useBack, useList, type BaseRecord, type HttpError } from "@refinedev/core";
import * as z from "zod";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { Direction } from "@/types";

const eventCreateSchema = z.object({
    directionId: z.coerce
        .number({
            required_error: "Направление обязательно",
            invalid_type_error: "Направление обязательно",
        })
        .min(1, "Направление обязательно"),
    name: z.string().min(3, "Название мероприятия должно быть не менее 3 символов"),
    code: z.string().min(3, "Код мероприятия должен быть не менее 3 символов"),
    description: z
        .string()
        .min(5, "Описание мероприятия должно быть не менее 5 символов"),
});

type EventFormValues = z.infer<typeof eventCreateSchema>;

const EventsCreate = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, EventFormValues>({
        resolver: zodResolver(eventCreateSchema),
        refineCoreProps: {
            resource: "events",
            action: "create",
        },
        defaultValues: {
            directionId: 0,
            name: "",
            code: "",
            description: "",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const { query: directionsQuery } = useList<Direction>({
        resource: "directions",
        pagination: {
            pageSize: 100,
        },
    });

    const directions = directionsQuery.data?.data ?? [];
    const directionsLoading = directionsQuery.isLoading;

    const onSubmit = async (values: EventFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Ошибка создания мероприятия:", error);
        }
    };

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Создать мероприятие</h1>
            <div className="intro-row">
                <p>Укажите необходимую информацию для создания мероприятия.</p>
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
                                    name="directionId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Направление <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(Number(value))
                                                }
                                                value={field.value ? String(field.value) : ""}
                                                disabled={directionsLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Выберите направление" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {directions.map((direction) => (
                                                        <SelectItem
                                                            key={direction.id}
                                                            value={String(direction.id)}
                                                        >
                                                            {direction.name}
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
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Название мероприятия <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Субботник в парке" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Код мероприятия <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="ECO101" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
                                                    placeholder="Опишите мероприятие..."
                                                    className="min-h-28"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? "Создание..." : "Создать мероприятие"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default EventsCreate;