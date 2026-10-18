import {
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoMoradas from "../../assets/logoMoradasdoGabriel.png";
import { supabase } from "../../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin", { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(
          error.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos. Verifique suas credenciais."
            : error.message,
        );
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setErrorMessage(
        "Não foi possível conectar ao servidor. Tente novamente em instantes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-center items-center px-4 py-10 relative">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-aqua/55 via-brand-sand/20 to-transparent -z-10"
      />

      <div className="w-full max-w-md">
        <div className="mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-navy/75 hover:text-brand-navy transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Central do Hóspede</span>
          </Link>
        </div>

        <div className="rounded-3xl bg-white border-2 border-brand-aqua/80 p-6 sm:p-8 shadow-lg shadow-brand-navy/8">
          <div className="text-center mb-6">
            <div className="mx-auto w-24 h-24 rounded-2xl bg-white border-2 border-brand-aqua p-2 shadow-xs flex items-center justify-center">
              <img
                src={logoMoradas}
                alt="Logo Pousada Moradas do Gabriel"
                className="w-full h-full object-contain"
              />
            </div>

            <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/65 text-brand-navy text-xs font-extrabold">
              <Lock className="w-3.5 h-3.5" />
              Acesso Restrito
            </span>

            <h1 className="mt-2 text-2xl font-extrabold text-brand-navy">
              Painel Administrativo
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-brand-navy/70">
              Gerencie os links, o Guia do Hóspede e as métricas da Pousada
              Moradas do Gabriel.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-2xl bg-brand-sand/55 border border-brand-navy/20 p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-brand-navy font-semibold">
              <AlertCircle className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1.5"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-navy/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@moradasdogabriel.com.br"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-aqua transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-brand-navy/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-aqua transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-brand-navy hover:bg-brand-navy-light text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
