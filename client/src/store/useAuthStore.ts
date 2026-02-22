import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MeResponse {
    userId: string
    username: string
    userEmail?: string
}

interface AuthState {
    token: string| null;
    userId: string| null;
    username: string| null;
    authStatus: "checking" | "authenticated" | "unauthenticated";

    login: (token: string, userId: string, username: string ) => void;
    logout: () => void;
    setAuthenticatedUser: (user: MeResponse) => void;
    setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthState>()(
    //persist used to store state in localstorage
    persist(
        (set) =>({
            token: null,
            userId: null,
            username: null,
            authStatus: "checking",

            login:(token, userId, username) =>
                set({
                    token, 
                    userId,
                    username,
                }),
            
            setAuthenticatedUser:(user) => 
                set({
                    
                    userId: user.userId,
                    username: user.username,
                    authStatus: "authenticated"
                }),
                
            setUnauthenticated: () => 
                set({
                    userId: null,
                    username: null,
                    authStatus: "unauthenticated"
                }),

            logout:()=>
                set({
                    token: null,
                    userId: null,
                    username: null,
                }),
        }),

        {
            name: "auth-storage",
            partialize: (state) => ({
                userId: state.userId,
                userName: state.username
            })
        }
    )
)