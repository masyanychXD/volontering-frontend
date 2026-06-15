import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { CreateButton } from "@/components/refine-ui/buttons/create";

type DirectionListItem = {
    id: number;
    name: string;
    code?: string | null;
    description?: string | null;
    totalEvents?: number | null;
};

const DirectionsList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const directionColumns = useMemo<ColumnDef<DirectionListItem>[]>(
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
                header: () => <p className="column-title">Название</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
                filterFn: "includesString",
            },
            {
                id: "totalEvents",
                accessorKey: "totalEvents",
                size: 160,
                header: () => <p className="column-title">Мероприятия</p>,
                cell: ({ getValue }) => {
                    const total = getValue<number>();
                    return <Badge variant="secondary">{total ?? 0}</Badge>;
                },
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

    const searchFilters = searchQuery
        ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            },
            {
                field: "code",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    const directionsTable = useTable<DirectionListItem>({
        columns: directionColumns,
        refineCoreProps: {
            resource: "directions",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [...searchFilters],
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
            <h1 className="page-title">Направления</h1>

            <div className="intro-row">
                <p>Быстрый доступ к направлениям волонтерской деятельности.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Поиск по названию или коду..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                    <CreateButton resource="directions">+ Создать</CreateButton>
                </div>
            </div>

            <DataTable table={directionsTable} />
        </ListView>
    );
};

export default DirectionsList;