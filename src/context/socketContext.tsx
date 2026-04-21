import React, { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SocketContext } from "./useSocket";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    //join-workspace-room
    const socketRef = useRef<Socket | null>(null);
    const [notification, setNotification] = useState(0);

    useEffect(() => {
        socketRef.current = io("localhost:3002", {
            query: { token: localStorage.getItem("token") },
        });

        socketRef.current.on("connect", () => console.log("Connected to WS"));

        socketRef.current.on("notification-count", (notificationCount) => {
            setNotification(notificationCount);
        });

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, []);

    function joinWorkspaceRoom(workspaceId: string) {
        if (socketRef.current) {
            socketRef.current.emit("join-workspace-room", { workspaceId });
        }
    }

    function leaveWorkspaceRoom(workspaceId: string) {
        if (socketRef.current) {
            socketRef.current.emit("leave-workspace-room", { workspaceId });
        }
    }

    return (
        <SocketContext.Provider
            value={{
                socketRef,
                joinWorkspaceRoom,
                notification,
                setNotification,
                leaveWorkspaceRoom,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
