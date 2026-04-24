import { axiosInstance } from "@/api/api";
import { createContext, useContext, useState } from "react";
interface UserContextType {
    user: any | null; // You can replace 'any' with your User interface later
    token: string | null;
    login: (token: string, user: any) => void;
    logout: () => void;
}
export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem("token"));

    function login(token: string, user: any) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        setToken(token);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        console.log("headers common", axiosInstance.defaults.headers.common);
    }
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    }
    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
};
