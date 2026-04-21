import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";
interface SocketContextType {
    socketRef: React.RefObject<Socket | null>;
    joinWorkspaceRoom: (workspaceId: string) => void;
    notification: number;
    setNotification: React.Dispatch<React.SetStateAction<number>>;
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
