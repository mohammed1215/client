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

const queryClient = new QueryClient();
function App() {
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
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route
                        path="/dashboard"
                        element={<DashboardContentLayout />}
                    />
                    <Route path="/workspaces" element={<WorkspacePage />} />
                    <Route
                        path="/workspaces/:workspaceId/boards"
                        element={<BoardsPage />}
                    />
                    <Route
                        path="/boards/:boardId"
                        element={<BoardInfoPage />}
                    />
                    <Route path="search" element={<SearchPage />} />
                    <Route
                        path="/accept-invite"
                        element={<AcceptInvitationPage />}
                    />
                </Route>
            </Routes>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}

export default App;
