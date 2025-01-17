import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from '../utils/supabase.js';

const AuthContext = createContext ();

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    const signUpNewUser = async (email, password) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error){
            console.error('Sign up problem: ', error);
            return { success: false, error};
        }
        return { success: true, data};
    };

    const signInUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error){
                console.error('Sign In error: ', error)
                return {success: false, error: error.message}
            }
            console.log('Sign In success: ', data);
            return {success: true, data};
        } catch (error) {
            console.error('Sign In error', error);
        }
    }

    useEffect(() => {
        // Obtém a sessão atual do Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
    
        // Escuta mudanças no estado de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    
        // Limpeza do efeito para evitar vazamentos de memória
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut(); // Await the signOut call
            if (error) {
                console.error("Sign out problem", error);
            } else {
                console.log("User  signed out successfully")
            }
        } catch (err) {
            console.error("An unexpected error occurred during sign out:", err);
        }
    };

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}