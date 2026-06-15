import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

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

import { Event } from "@/types";
import { DIRECTIONS_OPTIONS } from "@/constants";

const EventsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDirection, setSelectedDirection] = useState<string>("all");

    const eventColumns = useMemo<ColumnDef<Event>[]>(
        () => [
            {
                id: "code",
                accessorKey: "code",
                size: 100,
                header: () => <p className="column-title ml-2">Код</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
            },
            {
                id: "name",
                accessorKey: "name",
                size: 200,
                header: () => <p className="column-title">Название</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
                filterFn: "includesString",
            },
            {
                id: "direction",
                accessorKey: "direction.name",
                size: 150,
                header: () => <p className="column-title">Направление</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue<string>()}</Badge>
                ),
            },
            {
                id: "description",
                accessorKey: "description",
                size: 300,
                header: () => <p className="column-title">Описание</p>,
                cell: ({ getValue }) => (
                    <span className="truncate line-clamp-2">{getValue<string>()}</span>
                ),
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

    const directionFilters =
        selectedDirection === "all"
            ? []
            : [
                {
                    field: "direction",
                    operator: "eq" as const,
                    value: selectedDirection,
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

    const eventTable = useTable<Event>({
        columns: eventColumns,
        refineCoreProps: {
            resource: "events",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [...directionFilters, ...searchFilters],
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
            <h1 className="page-title">Мероприятия</h1>

            <div className="intro-row">
                <p>Быстрый доступ ко всем мероприятиям и событиям.</p>

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
                        <Select
                            value={selectedDirection}
                            onValueChange={setSelectedDirection}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Фильтр по направлению" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">Все направления</SelectItem>
                                {DIRECTIONS_OPTIONS.map((direction) => (
                                    <SelectItem key={direction.value} value={direction.value}>
                                        {direction.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <CreateButton resource="events">+ Создать</CreateButton>
                    </div>
                </div>
            </div>

            <DataTable table={eventTable} />
        </ListView>
    );
};

export default EventsList;