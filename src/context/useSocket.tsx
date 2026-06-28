import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";
interface SocketContextType {
    socketRef: React.RefObject<Socket | null>;
    joinWorkspaceRoom: (workspaceId: string) => void;
    notification: { notificationCount?: number } | undefined;
    setNotification: React.Dispatch<
        React.SetStateAction<{ notificationCount?: number } | undefined>
    >;
    leaveWorkspaceRoom: (workspaceId: string) => void;
}
export const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
