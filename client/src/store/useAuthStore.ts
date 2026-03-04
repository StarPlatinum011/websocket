import { AuthToken, UserId } from "@/types/ids";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AuthState {
    token: AuthToken | null;
    userId: UserId | null;
    username: string| null;
    authStatus: "checking" | "authenticated" | "unauthenticated";
    hasHydrated: boolean;

    login: (token: AuthToken, userId: UserId, username: string ) => void;
    logout: () => void;
    setUnauthenticatedUser: () => void;
}

export const useAuthStore = create<AuthState>()(
    //persist used to store state in localstorage
    persist(
        (set) =>({
            token: null,
            userId: null,
            username: null,
            authStatus: "checking",
            hasHydrated: false,


            login:(token, userId, username) =>{                
                set({
                    token, 
                    userId,
                    username,
                    authStatus: "authenticated"
                });
            },
                
            setUnauthenticatedUser: () => 
                set({
                    token: null,
                    userId: null,
                    username: null,
                    authStatus: "unauthenticated"
                }),

            logout:()=>{
                set({
                    token: null,
                    userId: null,
                    username: null,
                    authStatus: "unauthenticated"
                })                
            },

        }),
        

        {
            name: "auth-storage",
            partialize: (state) => ({
                token: state.token,
                userId: state.userId,
                username: state.username
            }),
            onRehydrateStorage(state) {
                if (!state) return;

                state.hasHydrated = true;
            },
        }
    )
)
