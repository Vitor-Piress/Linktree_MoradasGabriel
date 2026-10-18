import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { AuthContext } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        if (isMounted) {
          setSession(currentSession);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-brand-navy">
        <div className="w-14 h-14 rounded-2xl bg-brand-aqua/60 flex items-center justify-center mb-3 shadow-sm">
          <Loader2 className="w-7 h-7 animate-spin text-brand-navy" />
        </div>
        <p className="text-sm font-medium text-brand-navy/80">
          Verificando sessão...
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
