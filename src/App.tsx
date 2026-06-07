import { GitHubBanner, Refine} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "@/pages/dashboard.tsx";
import {BookOpen, GraduationCap, Home} from "lucide-react";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import EventsList from "@/pages/events/list.tsx";
import EventsCreate from "@/pages/events/create.tsx";
import SessionsList from "@/pages/sessions/list.tsx";
import SessionsCreate from "@/pages/sessions/create.tsx";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "IRFv3l-86ON1N-tH0v1d",
              }}

              resources={[
                  {
                      name: 'Dashboard',
                      list: '/',
                      meta: {label: 'Главная', icon: <Home />}
                  },
                  {
                      name: 'events',
                      list: '/events',
                      create: '/events/create',
                      meta: {label: 'Мероприятия', icon: <BookOpen />}
                  },
                  {
                      name: 'sessions',
                      list: '/sessions',
                      create: '/sessions/create',
                      meta: {label: 'Событие', icon: <GraduationCap />}
                  }
              ]}
            >
              <Routes>
                  <Route element={
                      <Layout>
                          <Outlet />
                      </Layout>
                  }>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="events">
                          <Route index element={<EventsList />} />
                          <Route path="create" element={<EventsCreate />} />
                      </Route>

                      <Route path="sessions">
                          <Route index element={<SessionsList />} />
                          <Route path="create" element={<SessionsCreate />} />
                      </Route>
                  </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
