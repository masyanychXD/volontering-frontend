import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { useSearchParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import type { User } from "@/types";

const CoordinatorsList = () => {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") ?? ""
    );

    const coordinatorColumns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 220,
                header: () => <p className="column-title">Имя</p>,
                cell: ({ row, getValue }) => {
                    const name = getValue<string>();
                    const image = row.original.image;
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar>
                                {image && <AvatarImage src={image} alt={name} />}
                                <AvatarFallback>{getInitials(name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-foreground">{name}</span>
                        </div>
                    );
                },
            },
            {
                id: "email",
                accessorKey: "email",
                size: 240,
                header: () => <p className="column-title">Email</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: "role",
                accessorKey: "role",
                size: 120,
                header: () => <p className="column-title">Роль</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
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

    const searchFilters = searchQuery
        ? [
            {
                field: "search",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    const coordinatorsTable = useTable<User>({
        columns: coordinatorColumns,
        refineCoreProps: {
            resource: "users",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [
                    {
                        field: "role",
                        operator: "eq" as const,
                        value: "coordinator",
                    },
                    ...searchFilters,
                ],
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
            <h1 className="page-title">Координаторы</h1>

            <div className="intro-row">
                <p>Просмотр и управление координаторами.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Поиск по имени или email..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                </div>
            </div>

            <DataTable table={coordinatorsTable} />
        </ListView>
    );
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

export default CoordinatorsList;