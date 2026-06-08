import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreate, useGetIdentity, useList } from "@refinedev/core";
import { useNavigate } from "react-router";

import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { SessionDetails, User } from "@/types";

const enrollSchema = z.object({
    sessionId: z.coerce.number().min(1, "Сессия обязательна"),
});

type EnrollFormValues = z.infer<typeof enrollSchema>;

const EnrollmentsCreate = () => {
    const navigate = useNavigate();
    const {
        mutateAsync: createEnrollment,
        mutation: { isPending },
    } = useCreate();
    const { data: currentUser } = useGetIdentity<User>();

    const { query: sessionsQuery } = useList<SessionDetails>({
        resource: "sessions",
        pagination: {
            pageSize: 100,
        },
    });

    const sessions = sessionsQuery.data?.data ?? [];
    const sessionsLoading = sessionsQuery.isLoading;

    const form = useForm<EnrollFormValues>({
        resolver: zodResolver(enrollSchema),
        defaultValues: {
            sessionId: 0,
        },
    });

    const selectedSessionId = form.watch("sessionId");

    const onSubmit = async (values: EnrollFormValues) => {
        if (!currentUser?.id) return;

        const response = await createEnrollment({
            resource: "enrollments",
            values: {
                sessionId: values.sessionId,
                volunteerId: currentUser.id,
            },
        });

        navigate("/enrollments/confirm", {
            state: {
                enrollment: response?.data,
            },
        });
    };

    const isSubmitDisabled =
        isPending ||
        sessionsLoading ||
        !currentUser?.id ||
        !sessions.length ||
        !selectedSessionId;

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Записаться на сессию</h1>
            <div className="intro-row">
                <p>Выберите сессию для записи в качестве волонтера.</p>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Форма записи
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <FormField
                                    control={form.control}
                                    name="sessionId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Сессия <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                value={field.value ? String(field.value) : ""}
                                                disabled={sessionsLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Выберите сессию" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {sessions.map((session) => (
                                                        <SelectItem
                                                            key={session.id}
                                                            value={String(session.id)}
                                                        >
                                                            {session.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormItem>
                                    <FormLabel>Волонтер</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={currentUser?.email ?? "Не авторизован"}
                                            readOnly
                                        />
                                    </FormControl>
                                </FormItem>

                                <Button type="submit" size="lg" disabled={isSubmitDisabled}>
                                    {isPending ? "Запись..." : "Записаться"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default EnrollmentsCreate;