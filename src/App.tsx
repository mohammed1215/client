import { Navigate, Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignUp.tsx";
import { LoginPage } from "./pages/Login.tsx";
import { LoginHeader } from "./components/Layouts/LoginHeader.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardContentLayout } from "./components/Layouts/DashboardContentLayout.tsx";
import { WorkspacePage } from "./pages/Workspace.tsx";
import { BoardsPage } from "./pages/Board.tsx";
import { BoardInfoPage } from "./pages/BoardInfo.tsx";
import { SearchPage } from "./pages/Search.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthorizeUser } from "./components/AuthorizeUser.tsx";
import { ForgotPassword } from "./pages/ForgotPassword.tsx";
import { ResetPassword } from "./pages/ResetPassword.tsx";
import { AcceptInvitationPage } from "./pages/AcceptInvitateionPage.tsx";
import { VerifyEmail } from "./pages/VerifyEmail.tsx";
import { useState } from "react";
import { SocketLayer } from "./socket/socket.tsx";

const queryClient = new QueryClient();
function App() {
    const [notificationCount, setNotificationCount] = useState<number | null>(
        null,
    );
    const [prevWorkspace, setPrevWorkspace] = useState<string | null>(null);
    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route element={<LoginHeader />}>
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/Login" element={<LoginPage />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>
                <Route element={<AuthorizeUser />}>
                    <Route element={<SocketLayer />}>
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" />}
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <DashboardContentLayout
                                    notificationCount={notificationCount}
                                />
                            }
                        />
                        <Route
                            path="/workspaces"
                            element={
                                <WorkspacePage
                                    notificationCount={notificationCount}
                                    // workspaceId={prevWorkspace}
                                />
                            }
                        />

                        <Route
                            path="/workspaces/:workspaceId/boards"
                            element={
                                <BoardsPage
                                    notificationCount={notificationCount}
                                    // setPrevWorkspace={setPrevWorkspace}
                                />
                            }
                        />
                        <Route
                            path="/boards/:boardId"
                            element={
                                <BoardInfoPage
                                    notificationCount={notificationCount}
                                />
                            }
                        />
                        <Route path="search" element={<SearchPage />} />
                        <Route
                            path="/accept-invite"
                            element={<AcceptInvitationPage />}
                        />
                    </Route>
                </Route>
            </Routes>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}

export default App;
