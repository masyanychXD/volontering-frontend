import { AdvancedImage } from "@cloudinary/react";
import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";
import { SessionDetails } from "@/types";

type SessionVolunteer = {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
};

const SessionsShow = () => {
    const { id } = useParams();
    const sessionId = id ?? "";

    const { query } = useShow<SessionDetails>({
        resource: "sessions",
    });

    const sessionDetails = query.data?.data;

    const volunteerColumns = useMemo<ColumnDef<SessionVolunteer>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 240,
                header: () => <p className="column-title">Волонтер</p>,
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
        ],
        []
    );

    const volunteersTable = useTable<SessionVolunteer>({
        columns: volunteerColumns,
        refineCoreProps: {
            resource: `sessions/${sessionId}/volunteers`,
            pagination: {
                pageSize: 3,
                mode: "server",
            },
        },
    });

    if (query.isLoading || query.isError || !sessionDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="sessions" title="Детали сессии" />
                <p className="state-message">
                    {query.isLoading
                        ? "Загрузка..."
                        : query.isError
                            ? "Ошибка загрузки."
                            : "Сессия не найдена."}
                </p>
            </ShowView>
        );
    }

    const coordinatorName = sessionDetails.coordinator?.name ?? "Неизвестно";
    const coordinatorInitials = coordinatorName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
        coordinatorInitials || "NA"
    )}`;

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="sessions" title="Детали сессии" />

            <div className="banner">
                {sessionDetails.bannerUrl ? (
                    sessionDetails.bannerUrl.includes("res.cloudinary.com") &&
                    sessionDetails.bannerCldPubId ? (
                        <AdvancedImage
                            cldImg={bannerPhoto(
                                sessionDetails.bannerCldPubId ?? "",
                                sessionDetails.name
                            )}
                            alt="Баннер сессии"
                        />
                    ) : (
                        <img
                            src={sessionDetails.bannerUrl}
                            alt={sessionDetails.name}
                            loading="lazy"
                        />
                    )
                ) : (
                    <div className="placeholder" />
                )}
            </div>

            <Card className="details-card">
                <div>
                    <div className="details-header">
                        <div>
                            <h1>{sessionDetails.name}</h1>
                            <p>{sessionDetails.description}</p>
                        </div>

                        <div>
                            <Badge variant="outline">{sessionDetails.capacity} мест</Badge>
                            <Badge
                                variant={
                                    sessionDetails.status === "Открыто" ? "default" : "secondary"
                                }
                                data-status={sessionDetails.status}
                            >
                                {sessionDetails.status?.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="instructor">
                            <p>👤 Координатор</p>
                            <div>
                                <img
                                    src={sessionDetails.coordinator?.image ?? placeholderUrl}
                                    alt={coordinatorName}
                                />
                                <div>
                                    <p>{coordinatorName}</p>
                                    <p>{sessionDetails?.coordinator?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="department">
                            <p>🧭 Направление</p>
                            <div>
                                <p>{sessionDetails?.direction?.name}</p>
                                <p>{sessionDetails?.direction?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="subject">
                    <p>📅 Мероприятие</p>
                    <div>
                        <Badge variant="outline">
                            Код: <span>{sessionDetails?.event?.code}</span>
                        </Badge>
                        <p>{sessionDetails?.event?.name}</p>
                        <p>{sessionDetails?.event?.description}</p>
                    </div>
                </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Записанные волонтеры</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable table={volunteersTable} />
                </CardContent>
            </Card>
        </ShowView>
    );
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return `${parts[0][0] ?? ""}${
        parts[parts.length - 1][0] ?? ""
    }`.toUpperCase();
};

export default SessionsShow;