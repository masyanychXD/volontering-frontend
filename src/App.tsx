import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import {
    Calendar,
    Compass,
    Heart,
    HeartHandshake,
    Home,
    Users,
    UserCircle,
} from "lucide-react";

import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import { Layout } from "./components/refine-ui/layout/layout";

import Dashboard from "./pages/dashboard";
import { Login } from "./pages/login";
import { Register } from "./pages/register";

import EventsList from "./pages/events/list";
import EventsCreate from "./pages/events/create";
import EventsShow from "./pages/events/show";

import SessionsList from "./pages/sessions/list";
import SessionsCreate from "./pages/sessions/create";
import SessionsShow from "./pages/sessions/show";

import DirectionsList from "./pages/directions/list";
import DirectionsCreate from "./pages/directions/create";
import DirectionShow from "./pages/directions/show";

import CoordinatorsList from "./pages/coordinators/list";
import CoordinatorShow from "./pages/coordinators/show";

import EnrollmentsCreate from "./pages/enrollments/create";
import EnrollmentsJoin from "./pages/enrollments/join";
import EnrollmentConfirm from "./pages/enrollments/confirm";

import ProfileShow from "./pages/profile/show";
import ProfileEdit from "./pages/profile/edit";

function App() {
    // Роль из localStorage (обновляется через authProvider.check с сервера)
    const getRole = (): "admin" | "coordinator" | "student" | null => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) return null;
            return JSON.parse(userStr).role ?? null;
        } catch {
            return null;
        }
    };

    const role = getRole();

    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ThemeProvider>
                    <DevtoolsProvider>
                        <Refine
                            dataProvider={dataProvider}
                            authProvider={authProvider}
                            notificationProvider={useNotificationProvider()}
                            routerProvider={routerProvider}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                projectId: "IRFv3l-86ON1N-tH0v1d",
                                title: {
                                    text: "ДоброЦентр",
                                    icon: (
                                        <img
                                            src="/logo.png"
                                            alt="ДоброЦентр"
                                            className="h-15 w-auto"
                                        />
                                    ),
                                },
                            }}
                            resources={[
                                // Главная: только админ
                                ...(role === "admin"
                                    ? [
                                        {
                                            name: "dashboard",
                                            list: "/",
                                            meta: { label: "Главная", icon: <Home /> },
                                        },
                                    ]
                                    : []),
                                // Мероприятия: админ и координатор
                                ...(role === "admin" || role === "coordinator"
                                    ? [
                                        {
                                            name: "events",
                                            list: "/events",
                                            create: "/events/create",
                                            show: "/events/show/:id",
                                            meta: { label: "Мероприятия", icon: <Calendar /> },
                                        },
                                    ]
                                    : []),
                                // Направления: админ (create) или координатор (без create)
                                ...(role === "admin"
                                    ? [
                                        {
                                            name: "directions",
                                            list: "/directions",
                                            create: "/directions/create",
                                            show: "/directions/show/:id",
                                            meta: { label: "Направления", icon: <Compass /> },
                                        },
                                    ]
                                    : role === "coordinator"
                                        ? [
                                            {
                                                name: "directions",
                                                list: "/directions",
                                                show: "/directions/show/:id",
                                                meta: { label: "Направления", icon: <Compass /> },
                                            },
                                        ]
                                        : []),
                                // Координаторы: только админ
                                ...(role === "admin"
                                    ? [
                                        {
                                            name: "users",
                                            list: "/coordinators",
                                            show: "/coordinators/show/:id",
                                            meta: { label: "Координаторы", icon: <Users /> },
                                        },
                                    ]
                                    : []),
                                // Записи: все
                                {
                                    name: "enrollments",
                                    list: "/enrollments/create",
                                    create: "/enrollments/create",
                                    meta: { label: "Записи", icon: <Heart /> },
                                },
                                // Сессии: все, но create только админ/координатор
                                {
                                    name: "sessions",
                                    list: "/sessions",
                                    create:
                                        role === "admin" || role === "coordinator"
                                            ? "/sessions/create"
                                            : undefined,
                                    show: "/sessions/show/:id",
                                    meta: { label: "Сессии", icon: <HeartHandshake /> },
                                },
                                // Профиль: все
                                {
                                    name: "profile",
                                    list: "/profile",
                                    meta: { label: "Профиль", icon: <UserCircle /> },
                                },
                            ]}
                        >
                            <Routes>
                                <Route
                                    element={
                                        <Authenticated key="public-routes" fallback={<Outlet />}>
                                            <NavigateToResource fallbackTo="/profile" />
                                        </Authenticated>
                                    }
                                >
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                </Route>

                                <Route
                                    element={
                                        <Authenticated key="private-routes" fallback={<Login />}>
                                            <Layout>
                                                <Outlet />
                                            </Layout>
                                        </Authenticated>
                                    }
                                >
                                    <Route path="/" element={role === "admin" ? <Dashboard /> : <NavigateToResource resource="profile" />} />

                                    {(role === "admin" || role === "coordinator") && (
                                        <Route path="events">
                                            <Route index element={<EventsList />} />
                                            <Route path="create" element={<EventsCreate />} />
                                            <Route path="show/:id" element={<EventsShow />} />
                                        </Route>
                                    )}

                                    {(role === "admin" || role === "coordinator") && (
                                        <Route path="directions">
                                            <Route index element={<DirectionsList />} />
                                            {role === "admin" && <Route path="create" element={<DirectionsCreate />} />}
                                            <Route path="show/:id" element={<DirectionShow />} />
                                        </Route>
                                    )}

                                    {role === "admin" && (
                                        <Route path="coordinators">
                                            <Route index element={<CoordinatorsList />} />
                                            <Route path="show/:id" element={<CoordinatorShow />} />
                                        </Route>
                                    )}

                                    <Route path="enrollments">
                                        <Route path="create" element={<EnrollmentsCreate />} />
                                        <Route path="join" element={<EnrollmentsJoin />} />
                                        <Route path="confirm" element={<EnrollmentConfirm />} />
                                    </Route>

                                    <Route path="sessions">
                                        <Route index element={<SessionsList />} />
                                        {(role === "admin" || role === "coordinator") && (
                                            <Route path="create" element={<SessionsCreate />} />
                                        )}
                                        <Route path="show/:id" element={<SessionsShow />} />
                                    </Route>

                                    <Route path="profile">
                                        <Route index element={<ProfileShow />} />
                                        <Route path="edit" element={<ProfileEdit />} />
                                    </Route>
                                </Route>
                            </Routes>

                            <Toaster />
                            <RefineKbar />
                            <UnsavedChangesNotifier />

                        </Refine>
                    </DevtoolsProvider>
                </ThemeProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;