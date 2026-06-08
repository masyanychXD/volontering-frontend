import { useLocation, useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowView } from "@/components/refine-ui/views/show-view";

type EnrollmentDetails = {
    id: number;
    session?: {
        id: number;
        name: string;
    };
    event?: {
        id: number;
        name: string;
    };
    direction?: {
        id: number;
        name: string;
    };
    coordinator?: {
        id: string;
        name: string;
        email: string;
    };
};

const EnrollmentConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const enrollment = (location.state as { enrollment?: EnrollmentDetails })
        ?.enrollment;

    if (!enrollment) {
        return (
            <ShowView className="class-view">
                <Card>
                    <CardHeader>
                        <CardTitle>Запись</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Нет данных о записи.
                        </p>
                        <Button className="mt-4" onClick={() => navigate("/sessions")}>
                            К сессиям
                        </Button>
                    </CardContent>
                </Card>
            </ShowView>
        );
    }

    return (
        <ShowView className="class-view space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Запись подтверждена</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Вы успешно записаны на сессию.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {enrollment.direction && (
                            <Badge variant="secondary">{enrollment.direction.name}</Badge>
                        )}
                        {enrollment.event && (
                            <Badge variant="outline">{enrollment.event.name}</Badge>
                        )}
                        {enrollment.session && (
                            <Badge variant="outline">{enrollment.session.name}</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Детали сессии</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Сессия</p>
                        <p className="text-base font-semibold">
                            {enrollment.session?.name ?? "Неизвестно"}
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <p className="text-sm text-muted-foreground">Координатор</p>
                        <p className="text-base font-semibold">
                            {enrollment.coordinator?.name ?? "Неизвестно"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {enrollment.coordinator?.email ?? "Нет email"}
                        </p>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                        <Button onClick={() => navigate("/sessions")}>К сессиям</Button>
                        {enrollment.session?.id && (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    navigate(`/sessions/show/${enrollment.session?.id}`)
                                }
                            >
                                Перейти к сессии
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </ShowView>
    );
};

export default EnrollmentConfirm;