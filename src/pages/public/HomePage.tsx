import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GuestGuideTab } from "../../components/public/GuestGuideTab";
import { LinksTab } from "../../components/public/LinksTab";
import { PublicHeader } from "../../components/public/PublicHeader";
import { useActiveLinks, useBusinessInfo } from "../../hooks/usePortalData";
import {
  DEFAULT_BUSINESS_METADATA,
  trackGuideInteraction,
  trackPageView,
} from "../../services";

type ActiveTab = "links" | "guide";

export function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("links");

  const { data: links = [], isLoading: isLoadingLinks } = useActiveLinks();
  const { data: businessInfo } = useBusinessInfo();

  const metadata = businessInfo?.metadata ?? DEFAULT_BUSINESS_METADATA;
  const welcomeMessage =
    businessInfo?.content ??
    "Seja muito bem-vindo! Aqui você encontra nossos links rápidos e o guia completo para aproveitar sua estadia.";

  useEffect(() => {
    trackPageView("home");
  }, []);

  const handleNavigateToLocation = () => {
    setActiveTab("guide");
    window.setTimeout(() => {
      const el = document.getElementById("como-chegar");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === "guide") {
      trackGuideInteraction("open_guide_tab");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between">
      <div className="w-full max-w-lg mx-auto px-4 pb-10">
        {/* Header Principal */}
        <PublicHeader
          welcomeMessage={welcomeMessage}
          contacts={metadata.contacts}
          links={links}
          onNavigateToLocation={handleNavigateToLocation}
        />

        {/* Seletor de 2 Abas em Estilo Pílula */}
        <nav
          aria-label="Seções da Central do Hóspede"
          className="mt-2 mb-6 p-1.5 rounded-full bg-brand-aqua/55 border border-brand-navy/12 grid grid-cols-2 gap-1.5 shadow-inner"
        >
          <button
            type="button"
            onClick={() => handleTabChange("links")}
            className={`py-2.5 px-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === "links"
                ? "bg-brand-navy text-white shadow-sm"
                : "text-brand-navy/80 hover:text-brand-navy hover:bg-white/50"
            }`}
          >
            <span>📲 Links & Contatos</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("guide")}
            className={`py-2.5 px-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === "guide"
                ? "bg-brand-navy text-white shadow-sm"
                : "text-brand-navy/80 hover:text-brand-navy hover:bg-white/50"
            }`}
          >
            <span>🏖️ Guia do Hóspede</span>
            <span
              className={`w-2 h-2 rounded-full ${
                activeTab === "guide" ? "bg-brand-green" : "bg-brand-navy/40"
              }`}
            />
          </button>
        </nav>

        {/* Conteúdo da Aba Selecionada */}
        <main>
          {activeTab === "links" ? (
            <LinksTab
              links={links}
              isLoading={isLoadingLinks}
              contacts={metadata.contacts}
              onSwitchToGuide={() => handleTabChange("guide")}
            />
          ) : (
            <GuestGuideTab metadata={metadata} />
          )}
        </main>
      </div>

      {/* Rodapé acolhedor */}
      <footer className="w-full max-w-lg mx-auto px-4 py-6 border-t border-brand-navy/10 text-center space-y-2">
        <p className="text-xs font-semibold text-brand-navy/70">
          © {new Date().getFullYear()} Pousada Moradas do Gabriel •
          Hospitalidade Solar & Costeira
        </p>
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-navy/45 hover:text-brand-navy transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Painel da Pousada</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
