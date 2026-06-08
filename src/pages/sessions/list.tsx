import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

import { Event, User } from "@/types";

type SessionListItem = {
    id: number;
    name: string;
    status: string;
    bannerUrl?: string;
    event?: {
        name: string;
    };
    coordinator?: {
        name: string;
    };
    capacity: number;
};

const getRole = (): string | null => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        return JSON.parse(userStr).role ?? null;
    } catch {
        return null;
    }
};

const SessionsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<string>("all");
    const [selectedCoordinator, setSelectedCoordinator] = useState<string>("all");

    const sessionColumns = useMemo<ColumnDef<SessionListItem>[]>(
        () => [
            {
                id: "banner",
                accessorKey: "bannerUrl",
                size: 120,
                header: () => <p className="column-title ml-2">Баннер</p>,
                cell: ({ getValue }) => {
                    const bannerUrl = getValue<string>();
                    return bannerUrl ? (
                        <img
                            src={bannerUrl}
                            alt="Баннер сессии"
                            className="ml-2 h-10 w-10 rounded-md object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-muted-foreground ml-2">Нет фото</span>
                    );
                },
            },
            {
                id: "name",
                accessorKey: "name",
                size: 220,
                header: () => <p className="column-title">Название</p>,
                cell: ({ getValue }) => {
                    const name = getValue<string>();
                    return <span className="text-foreground">{name}</span>;
                },
            },
            {
                id: "status",
                accessorKey: "status",
                size: 140,
                header: () => <p className="column-title">Статус</p>,
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    const variant = status === "Открыто" ? "default" : "secondary";
                    return <Badge variant={variant}>{status}</Badge>;
                },
            },
            {
                id: "event",
                accessorKey: "event.name",
                size: 200,
                header: () => <p className="column-title">Мероприятие</p>,
                cell: ({ getValue }) => {
                    const eventName = getValue<string>();
                    return eventName ? (
                        <Badge variant="secondary">{eventName}</Badge>
                    ) : (
                        <span className="text-muted-foreground">Не указано</span>
                    );
                },
            },
            {
                id: "coordinator",
                accessorKey: "coordinator.name",
                size: 200,
                header: () => <p className="column-title">Координатор</p>,
                cell: ({ getValue }) => {
                    const coordinatorName = getValue<string>();
                    return coordinatorName ? (
                        <span className="text-foreground">{coordinatorName}</span>
                    ) : (
                        <span className="text-muted-foreground">Не назначен</span>
                    );
                },
            },
            {
                id: "capacity",
                accessorKey: "capacity",
                size: 120,
                header: () => <p className="column-title">Мест</p>,
                cell: ({ getValue }) => {
                    const capacity = getValue<number>();
                    return <span className="text-foreground">{capacity}</span>;
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

    const { query: eventsQuery } = useList<Event>({
        resource: "events",
        pagination: {
            pageSize: 100,
        },
    });

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

    const events = eventsQuery.data?.data || [];
    const coordinators = coordinatorsQuery.data?.data || [];

    const eventFilters =
        selectedEvent === "all"
            ? []
            : [
                {
                    field: "event",
                    operator: "eq" as const,
                    value: selectedEvent,
                },
            ];

    const coordinatorFilters =
        selectedCoordinator === "all"
            ? []
            : [
                {
                    field: "coordinator",
                    operator: "eq" as const,
                    value: selectedCoordinator,
                },
            ];

    const searchFilters = searchQuery
        ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    const sessionsTable = useTable<SessionListItem>({
        columns: sessionColumns,
        refineCoreProps: {
            resource: "sessions",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [...eventFilters, ...coordinatorFilters, ...searchFilters],
            },
            sorters: {
                initial: [
                    {
                        field: "id",
                        order: "desc",
                    },
                ],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Сессии</h1>

            <div className="intro-row">
                <p>Быстрый доступ к волонтерским сессиям.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Поиск по названию..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Фильтр по мероприятию" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все мероприятия</SelectItem>
                                {events.map((event) => (
                                    <SelectItem key={event.id} value={event.name}>
                                        {event.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedCoordinator} onValueChange={setSelectedCoordinator}>
                            <SelectTrigger>
                                <SelectValue placeholder="Фильтр по координатору" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все координаторы</SelectItem>
                                {coordinators.map((coordinator) => (
                                    <SelectItem key={coordinator.id} value={coordinator.name}>
                                        {coordinator.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {getRole() !== "student" && <CreateButton resource="sessions" />}
                    </div>
                </div>
            </div>

            <DataTable table={sessionsTable} />
        </ListView>
    );
};

export default SessionsList;