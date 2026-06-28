import { Navigate, Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignUp.tsx";
import { LoginPage } from "./pages/Login.tsx";
import { LoginHeader } from "./components/Layouts/LoginHeader.tsx";
import { useQuery } from "@tanstack/react-query";
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
import { SocketLayer } from "./socket/socket.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { NotificationPage } from "./pages/NotificationPage.tsx";
import api, { axiosInstance } from "./api/api.ts";
import type { NotificationFindAllResponse } from "./types/types.ts";
import { getUrl } from "./helpers/helpers.tsx";
import { useUser } from "./context/userContext.tsx";

function App() {
    const { token, user } = useUser();
    const queryGetNotifiation = useQuery({
        queryKey: [`get-notifications-${user?.id}`],
        queryFn: async () => {
            const response = await axiosInstance.get<
                NotificationFindAllResponse[]
            >(getUrl(api.notificationEndpoints.getAllNotifications), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
    });
    return (
        <>
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
                <Route element={<SocketLayer />}>
                    <Route
                        element={
                            <AuthorizeUser
                                notificationCount={
                                    queryGetNotifiation.data?.filter(
                                        (ni) => !ni.isRead,
                                    ).length
                                }
                            />
                        }
                    >
                        <Route
                            path="/"
                            element={<Navigate to="/workspaces" />}
                        />
                        {/* <Route
                            path="/dashboard"
                            element={
                                <DashboardContentLayout
                                    notificationCount={notificationCount}
                                />
                            }
                        /> */}
                        <Route
                            path="/workspaces"
                            element={
                                <WorkspacePage
                                    notificationCount={
                                        queryGetNotifiation.data?.filter(
                                            (ni) => !ni.isRead,
                                        ).length
                                    }
                                    // workspaceId={prevWorkspace}
                                />
                            }
                        />
                        <Route
                            path="/notifications"
                            element={
                                <NotificationPage
                                    isGettingNotifications={
                                        queryGetNotifiation.isPending
                                    }
                                    notifications={queryGetNotifiation.data}
                                />
                            }
                        />

                        <Route
                            path="/workspaces/:workspaceId/boards"
                            element={
                                <BoardsPage
                                // notificationCount={notificationCount}
                                // setPrevWorkspace={setPrevWorkspace}
                                />
                            }
                        />
                        <Route
                            path="/boards/:boardId"
                            element={
                                <BoardInfoPage
                                    notificationCount={
                                        queryGetNotifiation.data?.length
                                    }
                                />
                            }
                        />
                        <Route path="search" element={<SearchPage />} />
                        <Route
                            path="/accept-invite"
                            element={<AcceptInvitationPage />}
                        />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Route>
            </Routes>
            <ReactQueryDevtools />
        </>
    );
}

export default App;
