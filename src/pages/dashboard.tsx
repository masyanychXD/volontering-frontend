import { useMemo } from "react";
import { useLink, useList } from "@refinedev/core";
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Calendar,
    Compass,
    Heart,
    HeartHandshake,
    ShieldCheck,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Direction, Event, User } from "@/types";

type SessionListItem = {
    id: number;
    name: string;
    createdAt?: string;
    event?: {
        name: string;
    };
    coordinator?: {
        name: string;
    };
};

const roleColors = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7"];

const Dashboard = () => {
    const Link = useLink();
    const { query: usersQuery } = useList<User>({
        resource: "users",
        pagination: { mode: "off" },
    });

    const { query: eventsQuery } = useList<Event>({
        resource: "events",
        pagination: { mode: "off" },
    });

    const { query: directionsQuery } = useList<Direction>({
        resource: "directions",
        pagination: { mode: "off" },
    });

    const { query: sessionsQuery } = useList<SessionListItem>({
        resource: "sessions",
        pagination: { mode: "off" },
    });

    const users = usersQuery.data?.data ?? [];
    const events = eventsQuery.data?.data ?? [];
    const directions = directionsQuery.data?.data ?? [];
    const sessions = sessionsQuery.data?.data ?? [];

    const usersByRole = useMemo(() => {
        const counts = users.reduce<Record<string, number>>((acc, user) => {
            const role = user.role ?? "unknown";
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([role, total]) => ({ role, total }));
    }, [users]);

    const eventsByDirection = useMemo(() => {
        const counts = events.reduce<Record<string, number>>((acc, event) => {
            const directionName =
                (event as { direction?: { name?: string } }).direction?.name ??
                "Без направления";
            acc[directionName] = (acc[directionName] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([directionName, totalEvents]) => ({
            directionName,
            totalEvents,
        }));
    }, [events]);

    const sessionsByEvent = useMemo(() => {
        const counts = sessions.reduce<Record<string, number>>((acc, session) => {
            const eventName = session.event?.name ?? "Без мероприятия";
            acc[eventName] = (acc[eventName] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([eventName, totalSessions]) => ({
            eventName,
            totalSessions,
        }));
    }, [sessions]);

    const newestSessions = useMemo(() => {
        return [...sessions]
            .sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bTime - aTime;
            })
            .slice(0, 5);
    }, [sessions]);

    const newestCoordinators = useMemo(() => {
        return users
            .filter((user) => user.role === "coordinator")
            .sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bTime - aTime;
            })
            .slice(0, 5);
    }, [users]);

    const kpis = [
        {
            label: "Всего пользователей",
            value: users.length,
            icon: Users,
            accent: "text-blue-600",
        },
        {
            label: "Координаторов",
            value: users.filter((user) => user.role === "coordinator").length,
            icon: HeartHandshake,
            accent: "text-emerald-600",
        },
        {
            label: "Администраторов",
            value: users.filter((user) => user.role === "admin").length,
            icon: ShieldCheck,
            accent: "text-amber-600",
        },
        {
            label: "Мероприятий",
            value: events.length,
            icon: Calendar,
            accent: "text-purple-600",
        },
        {
            label: "Направлений",
            value: directions.length,
            icon: Compass,
            accent: "text-cyan-600",
        },
        {
            label: "Сессий",
            value: sessions.length,
            icon: Heart,
            accent: "text-rose-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Главная</h1>
                <p className="text-muted-foreground">
                    Обзор ключевых показателей и последней активности.
                </p>
            </div>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle>Обзор</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {kpis.map((kpi) => (
                            <div
                                key={kpi.label}
                                className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-muted-foreground">
                                        {kpi.label}
                                    </p>
                                    <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
                                </div>
                                <div className="mt-2 text-2xl font-semibold">{kpi.value}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Пользователи по ролям</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        dataKey="total"
                                        nameKey="role"
                                        data={usersByRole}
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                    >
                                        {usersByRole.map((entry, index) => (
                                            <Cell
                                                key={`${entry.role}-${index}`}
                                                fill={roleColors[index % roleColors.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {usersByRole.map((entry, index) => (
                                <span
                                    key={entry.role}
                                    className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                >
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor: roleColors[index % roleColors.length],
                                        }}
                                    />
                                    {entry.role} · {entry.total}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>Новые сессии (5)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">
                                {newestSessions.length}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Последние добавленные сессии
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>Новые координаторы (5)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">
                                {newestCoordinators.length}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Последние зарегистрированные координаторы
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Новые сессии</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {newestSessions.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Нет недавних сессий.
                            </p>
                        )}
                        {newestSessions.map((item, index) => (
                            <Link
                                key={item.id}
                                to={`/sessions/show/${item.id}`}
                                className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.event?.name ?? "Без мероприятия"} ·{" "}
                                            {item.coordinator?.name ?? "Без координатора"}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="secondary">Новое</Badge>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Новые координаторы</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {newestCoordinators.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Нет недавних координаторов.
                            </p>
                        )}
                        {newestCoordinators.map((coordinator, index) => (
                            <Link
                                key={coordinator.id}
                                to={`/coordinators/show/${coordinator.id}`}
                                className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium">{coordinator.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {coordinator.email}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="secondary">Новый</Badge>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Separator />
        </div>
    );
};

export default Dashboard;