import { useLink, useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import type { Direction, Event } from "@/types";

type EventDetails = {
    event: Event & {
        direction?: Direction | null;
    };
    totals: {
        sessions: number;
    };
};

type EventSession = {
    id: number;
    name: string;
    status?: string | null;
    capacity?: number | null;
    coordinator?: {
        id: string;
        name: string;
        email?: string | null;
        image?: string | null;
    } | null;
};

type EventUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
};

const EventsShow = () => {
    const Link = useLink();
    const { id } = useParams();
    const eventId = id ?? "";

    const { query } = useShow<EventDetails>({
        resource: "events",
    });

    const details = query.data?.data;

    const sessionColumns = useMemo<ColumnDef<EventSession>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 240,
                header: () => <p className="column-title">Сессия</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: "coordinator",
                accessorKey: "coordinator",
                size: 220,
                header: () => <p className="column-title">Координатор</p>,
                cell: ({ row }) => {
                    const coordinator = row.original.coordinator;
                    if (!coordinator) {
                        return <span className="text-muted-foreground">Не назначен</span>;
                    }

                    return (
                        <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                                {coordinator.image && (
                                    <AvatarImage src={coordinator.image} alt={coordinator.name} />
                                )}
                                <AvatarFallback>{getInitials(coordinator.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col truncate">
                                <span className="truncate">{coordinator.name}</span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {coordinator.email}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: "status",
                accessorKey: "status",
                size: 120,
                header: () => <p className="column-title">Статус</p>,
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    return (
                        <Badge variant={status === "Открыто" ? "default" : "secondary"}>
                            {status ?? "неизвестно"}
                        </Badge>
                    );
                },
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title">Детали</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="sessions"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        Смотреть
                    </ShowButton>
                ),
            },
        ],
        []
    );

    const userColumns = useMemo<ColumnDef<EventUser>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 240,
                header: () => <p className="column-title">Пользователь</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                            {row.original.image && (
                                <AvatarImage src={row.original.image} alt={row.original.name} />
                            )}
                            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="truncate">{row.original.name}</span>
                            <span className="text-xs text-muted-foreground truncate">
                                {row.original.email}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                id: "role",
                accessorKey: "role",
                size: 140,
                header: () => <p className="column-title">Роль</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue<string>()}</Badge>
                ),
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title">Детали</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="users"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        Смотреть
                    </ShowButton>
                ),
            },
        ],
        []
    );

    const sessionsTable = useTable<EventSession>({
        columns: sessionColumns,
        refineCoreProps: {
            resource: `events/${eventId}/sessions`,
            pagination: {
                pageSize: 10,
                mode: "server",
            },
        },
    });

    const coordinatorsTable = useTable<EventUser>({
        columns: userColumns,
        refineCoreProps: {
            resource: `events/${eventId}/users`,
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [
                    {
                        field: "role",
                        operator: "eq",
                        value: "coordinator",
                    },
                ],
            },
        },
    });

    const volunteersTable = useTable<EventUser>({
        columns: userColumns,
        refineCoreProps: {
            resource: `events/${eventId}/users`,
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [
                    {
                        field: "role",
                        operator: "eq",
                        value: "student",
                    },
                ],
            },
        },
    });

    if (query.isLoading || query.isError || !details) {
        return (
            <ShowView className="class-view">
                <ShowViewHeader resource="events" title="Детали мероприятия" />
                <p className="text-sm text-muted-foreground">
                    {query.isLoading
                        ? "Загрузка..."
                        : query.isError
                            ? "Ошибка загрузки."
                            : "Мероприятие не найдено."}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="class-view space-y-6">
            <ShowViewHeader resource="events" title={details.event.name} />

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex w-full flex-row items-center justify-between">
                    <CardTitle>Обзор мероприятия</CardTitle>
                    <Badge variant="secondary">{details.event.code}</Badge>
                </CardHeader>

                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        {details.event.description ?? "Нет описания."}
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle>Направление</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {details.event.direction ? (
                        <>
                            <Link
                                to={`/directions/show/${details.event.direction.id}`}
                                className="text-lg font-semibold text-foreground hover:underline"
                            >
                                {details.event.direction.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                {details.event.direction.description ??
                                    "Нет описания направления."}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Направление не назначено.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Сессии</CardTitle>
                    <Badge variant="secondary">{details.totals.sessions}</Badge>
                </CardHeader>
                <CardContent>
                    <DataTable table={sessionsTable} />
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Координаторы</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable table={coordinatorsTable} />
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Волонтеры</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable table={volunteersTable} />
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    );
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

export default EventsShow;