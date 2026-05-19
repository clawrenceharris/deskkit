"use client";
import { loginAction, signOutAction, signupAction } from "@/actions/auth";
import { supabase } from "@/lib/supabase/client";
import { LoginFormValues, SignUpFormValues } from "@/types";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type AuthContextType = {
    user: User | null;
    /** False until the first `getSession()` finishes — avoids treating a cold-start null user as “logged out”. */
    isAuthReady: boolean;
    signup: (data: SignUpFormValues) => Promise<void>;
    login: (data: LoginFormValues) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
   

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        let cancelled = false;

        void supabase.auth.getSession().then(({ data: { session } }) => {
            if (cancelled) return;
            setUser(session?.user ?? null);
            setIsAuthReady(true);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    },[]);


    /**
     * Sign up the user
     * @param data - The sign up data
     * @throws ApplicationError if the sign up fails
     */
    const signup = useCallback(async (data: SignUpFormValues) => {
        setIsLoading(true);
        const result = await signupAction(data);
        if(!result.success) {
            throw result.error;
        }
        setUser(result.data);
        router.replace("/");
        router.refresh();
        setIsLoading(false);
    }, [router]);
    /**
     * Login the user
     * @param data - The login data
     * @throws ApplicationError if the login fails
     */
    const login = useCallback(async (data: LoginFormValues) => {
        setIsLoading(true);
        const result = await loginAction(data);
        if(!result.success) {
            throw result.error;
        }
        setUser(result.data);
        setIsLoading(false)
        router.replace("/");
        router.refresh();
    }, [router]);

    /**
     * Sign out the user
     */
    const signOut = useCallback(async () => {
        setIsLoading(true);
        const result = await signOutAction();
        if(!result.success) {
            toast.error(result.error.message);
        }

        setUser(null);
        setIsLoading(false)

        router.replace("/auth/login");
        router.refresh();
    }, [router]);

    const value = {
        user,
        isAuthReady,
        signup,
        login,
        signOut,
        isLoading,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}