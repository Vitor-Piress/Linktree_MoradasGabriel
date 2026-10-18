import {
  Compass,
  Eye,
  MapPin,
  MousePointerClick,
  RefreshCw,
  Wifi,
} from "lucide-react";
import type { AnalyticsSummary } from "../../services";

interface AnalyticsOverviewProps {
  summary: AnalyticsSummary | undefined;
  isLoading: boolean;
  isFetching: boolean;
  onRefresh: () => void;
}

export function AnalyticsOverview({
  summary,
  isLoading,
  isFetching,
  onRefresh,
}: AnalyticsOverviewProps) {
  const pageViews = summary?.totalPageViews ?? 0;
  const linkClicks = summary?.totalLinkClicks ?? 0;
  const guideInteractions = summary?.totalGuideInteractions ?? 0;
  const wifiCopies = summary?.wifiCopies ?? 0;
  const mapClicks = summary?.totalMapInteractions ?? 0;

  return (
    <section aria-label="Resumo de Analytics" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-brand-navy">
            📊 Resumo de Analytics
          </h2>
          <p className="text-xs text-brand-navy/65">
            Acompanhe os acessos, cliques nos botões e uso da Central do Hóspede
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-navy/15 text-xs font-bold text-brand-navy hover:bg-brand-aqua/40 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          <span>Atualizar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Visualizações da Página (page_view) */}
        <div className="rounded-3xl bg-white border-2 border-brand-aqua/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-navy/65">
              Visualizações (Page Views)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-aqua/70 text-brand-navy flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-9 w-20 rounded-xl bg-brand-aqua/40 animate-pulse" />
            ) : (
              <p className="text-3xl font-extrabold text-brand-navy">
                {pageViews}
              </p>
            )}
            <p className="mt-1 text-xs text-brand-navy/65">
              Acessos únicos (janela de 30min)
            </p>
          </div>
        </div>

        {/* Card 2: Cliques nos Links (link_click) */}
        <div className="rounded-3xl bg-white border-2 border-brand-green/90 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-navy/65">
              Cliques nos Links
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-green/80 text-brand-navy flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-9 w-20 rounded-xl bg-brand-green/40 animate-pulse" />
            ) : (
              <p className="text-3xl font-extrabold text-brand-navy">
                {linkClicks}
              </p>
            )}
            <p className="mt-1 text-xs text-brand-navy/65">
              Total de cliques em botões e contatos
            </p>
          </div>
        </div>

        {/* Card 3: Interações no Guia do Hóspede (guide_interaction) */}
        <div className="rounded-3xl bg-white border-2 border-brand-sand p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-navy/65">
              Interações no Guia
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-sun/80 text-brand-navy flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-9 w-20 rounded-xl bg-brand-sand/40 animate-pulse" />
            ) : (
              <p className="text-3xl font-extrabold text-brand-navy">
                {guideInteractions}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-brand-navy">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-aqua/65">
                <Wifi className="w-3 h-3" />
                Wi-Fi copiado: {wifiCopies}x
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-sand/75">
                <MapPin className="w-3 h-3" />
                Mapas/Waze: {mapClicks}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
