import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AuthState {
    token: string| null;
    userId: string| null;
    userName: string| null;
    isAuthenticated: boolean;

    login: (token: string, userId: string, userName: string ) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    //persist used to store state in localstorage
    persist(
        (set) =>({
            token: null,
            userId: null,
            userName: null,
            isAuthenticated: false,

            login:(token, userId, userName) =>
                set({
                    token, 
                    userId,
                    userName,
                    isAuthenticated: true
                }),

            logout:()=>
                set({
                    token: null,
                    userId: null,
                    userName: null,
                    isAuthenticated: false
                }),
        }),

        {
            name: "auth-storage"
        }
    )
)