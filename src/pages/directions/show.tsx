import { useLink, useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Heart, Users } from "lucide-react";
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
import type { Direction } from "@/types";

type DirectionDetails = {
    direction: Direction;
    totals: {
        events: number;
        sessions: number;
        enrolledVolunteers: number;
    };
};

type DirectionEvent = {
    id: number;
    name: string;
    code?: string | null;
    description?: string | null;
};

type DirectionSession = {
    id: number;
    name: string;
    status?: string | null;
    capacity?: number | null;
    event?: {
        id: number;
        name: string;
        code?: string | null;
    } | null;
    coordinator?: {
        id: string;
        name: string;
        email?: string | null;
        image?: string | null;
    } | null;
};

type DirectionUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
};

const DirectionShow = () => {
    const Link = useLink();
    const { id } = useParams();
    const directionId = id ?? "";

    const { query } = useShow<DirectionDetails>({
        resource: "directions",
    });

    const details = query.data?.data;

    const eventColumns = useMemo<ColumnDef<DirectionEvent>[]>(
        () => [
            {
                id: "code",
                accessorKey: "code",
                size: 120,
                header: () => <p className="column-title ml-2">Код</p>,
                cell: ({ getValue }) => {
                    const code = getValue<string>();
                    return code ? (
                        <Badge>{code}</Badge>
                    ) : (
                        <span className="text-muted-foreground ml-2">Нет кода</span>
                    );
                },
            },
            {
                id: "name",
                accessorKey: "name",
                size: 220,
                header: () => <p className="column-title">Мероприятие</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: "description",
                accessorKey: "description",
                size: 320,
                header: () => <p className="column-title">Описание</p>,
                cell: ({ getValue }) => {
                    const description = getValue<string>();
                    return description ? (
                        <span className="truncate line-clamp-2">{description}</span>
                    ) : (
                        <span className="text-muted-foreground">Нет описания</span>
                    );
                },
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title">Детали</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="events"
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

    const sessionColumns = useMemo<ColumnDef<DirectionSession>[]>(
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
                id: "event",
                accessorKey: "event",
                size: 200,
                header: () => <p className="column-title">Мероприятие</p>,
                cell: ({ row }) => {
                    const event = row.original.event;
                    if (!event) {
                        return <span className="text-muted-foreground">Нет мероприятия</span>;
                    }
                    return (
                        <span className="truncate">
                            {event.name}
                            {event.code ? ` (${event.code})` : ""}
                        </span>
                    );
                },
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

    const userColumns = useMemo<ColumnDef<DirectionUser>[]>(
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

    const eventsTable = useTable<DirectionEvent>({
        columns: eventColumns,
        refineCoreProps: {
            resource: `directions/${directionId}/events`,
            pagination: {
                pageSize: 10,
                mode: "server",
            },
        },
    });

    const sessionsTable = useTable<DirectionSession>({
        columns: sessionColumns,
        refineCoreProps: {
            resource: `directions/${directionId}/sessions`,
            pagination: {
                pageSize: 10,
                mode: "server",
            },
        },
    });

    const coordinatorsTable = useTable<DirectionUser>({
        columns: userColumns,
        refineCoreProps: {
            resource: `directions/${directionId}/users`,
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

    const volunteersTable = useTable<DirectionUser>({
        columns: userColumns,
        refineCoreProps: {
            resource: `directions/${directionId}/users`,
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
                <ShowViewHeader resource="directions" title="Детали направления" />
                <p className="text-sm text-muted-foreground">
                    {query.isLoading
                        ? "Загрузка..."
                        : query.isError
                            ? "Ошибка загрузки."
                            : "Направление не найдено."}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="class-view space-y-6">
            <ShowViewHeader resource="directions" title={details.direction.name} />

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle>Обзор</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {details.direction.description ?? "Нет описания."}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                                <span>Всего мероприятий</span>
                                <Calendar className="h-4 w-4" />
                            </div>
                            <div className="mt-2 text-2xl font-semibold">
                                {details.totals.events}
                            </div>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                                <span>Всего сессий</span>
                                <Heart className="h-4 w-4" />
                            </div>
                            <div className="mt-2 text-2xl font-semibold">
                                {details.totals.sessions}
                            </div>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                                <span>Волонтеров</span>
                                <Users className="h-4 w-4" />
                            </div>
                            <div className="mt-2 text-2xl font-semibold">
                                {details.totals.enrolledVolunteers}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Мероприятия</CardTitle>
                    <Badge variant="secondary">{details.totals.events}</Badge>
                </CardHeader>
                <CardContent>
                    <DataTable table={eventsTable} />
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
                        <DataTable table={coordinatorsTable}  />
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

export default DirectionShow;