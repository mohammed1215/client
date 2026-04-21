import { SocketProvider } from "@/context/socketContext";
import { Outlet } from "react-router-dom";

export const SocketLayer = () => {
    return (
        <SocketProvider>
            <Outlet />
        </SocketProvider>
    );
};
