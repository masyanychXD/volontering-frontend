import { useShow } from "@refinedev/core";
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
import type { User } from "@/types";

type CoordinatorDirection = {
    id: number;
    name: string;
    code?: string | null;
    description?: string | null;
};

type CoordinatorEvent = {
    id: number;
    name: string;
    code?: string | null;
    description?: string | null;
    direction?: {
        id: number;
        name: string;
        code?: string | null;
    } | null;
};

const CoordinatorShow = () => {
    const { id } = useParams();
    const userId = id ?? "";

    const { query } = useShow<User>({
        resource: "users",
    });

    const user = query.data?.data;

    const directionColumns = useMemo<ColumnDef<CoordinatorDirection>[]>(
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
                header: () => <p className="column-title">Направление</p>,
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
                        resource="directions"
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

    const eventColumns = useMemo<ColumnDef<CoordinatorEvent>[]>(
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
                id: "direction",
                accessorKey: "direction",
                size: 200,
                header: () => <p className="column-title">Направление</p>,
                cell: ({ row }) => {
                    const direction = row.original.direction;
                    if (!direction) {
                        return <span className="text-muted-foreground">Нет направления</span>;
                    }
                    return (
                        <span className="truncate">
                            {direction.name}
                            {direction.code ? ` (${direction.code})` : ""}
                        </span>
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

    const directionsTable = useTable<CoordinatorDirection>({
        columns: directionColumns,
        refineCoreProps: {
            resource: `users/${userId}/directions`,
            pagination: {
                pageSize: 10,
                mode: "server",
            },
        },
    });

    const eventsTable = useTable<CoordinatorEvent>({
        columns: eventColumns,
        refineCoreProps: {
            resource: `users/${userId}/events`,
            pagination: {
                pageSize: 10,
                mode: "server",
            },
        },
    });

    if (query.isLoading || query.isError || !user) {
        return (
            <ShowView className="class-view">
                <ShowViewHeader resource="users" title="Детали координатора" />
                <p className="text-sm text-muted-foreground">
                    {query.isLoading
                        ? "Загрузка..."
                        : query.isError
                            ? "Ошибка загрузки."
                            : "Координатор не найден."}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="class-view space-y-6">
            <ShowViewHeader resource="users" title={user.name} />

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Профиль</CardTitle>
                    <Badge variant="default">{user.role}</Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="size-12">
                            {user.image && <AvatarImage src={user.image} alt={user.name} />}
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-lg font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Направления</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Направления, связанные с {user.name}.
                        </p>
                        <DataTable table={directionsTable}/>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Мероприятия</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Мероприятия, связанные с {user.name}.
                        </p>
                        <DataTable table={eventsTable} />
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

export default CoordinatorShow;