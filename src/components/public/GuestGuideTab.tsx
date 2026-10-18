import {
  Check,
  ClipboardCheck,
  Compass,
  Copy,
  ExternalLink,
  MapPin,
  Navigation,
  ShoppingBag,
  Sparkles,
  Sun,
  Umbrella,
  Utensils,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import type {
  BusinessInfoMetadata,
  PlaceTip,
} from "../../@types/database.types";
import { trackGuideInteraction } from "../../services";
import { extractEmbedUrl } from "../../utils/embedUrl";

interface GuestGuideTabProps {
  metadata: BusinessInfoMetadata;
}

const DEFAULT_CATEGORIES = [
  "Todos",
  "Gastronomia",
  "Praias",
  "Passeios",
  "Mercados",
] as const;

function getCategoryStyle(category: string) {
  const normalized = category.toLowerCase();
  if (
    normalized.includes("gastronomia") ||
    normalized.includes("restaurante")
  ) {
    return {
      badgeClass: "bg-brand-sand/80 text-brand-navy border-brand-sand",
      icon: Utensils,
    };
  }
  if (normalized.includes("praia")) {
    return {
      badgeClass: "bg-brand-aqua/85 text-brand-navy border-brand-aqua",
      icon: Umbrella,
    };
  }
  if (normalized.includes("passeio")) {
    return {
      badgeClass: "bg-brand-green/80 text-brand-navy border-brand-green",
      icon: Compass,
    };
  }
  if (normalized.includes("mercado") || normalized.includes("conveniência")) {
    return {
      badgeClass: "bg-brand-sun/60 text-brand-navy border-brand-sun",
      icon: ShoppingBag,
    };
  }
  return {
    badgeClass: "bg-brand-aqua/60 text-brand-navy border-brand-aqua",
    icon: Sparkles,
  };
}

export function GuestGuideTab({ metadata }: GuestGuideTabProps) {
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const { wifi, location, rules, places_tips } = metadata;
  const cleanEmbedUrl = extractEmbedUrl(location.embed_url || "");

  // Categorias dinâmicas combinando as padrões + eventuais categorias extras cadastradas
  const categories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...places_tips.map((p) => p.category).filter(Boolean),
    ]),
  );

  const filteredPlaces: PlaceTip[] =
    selectedCategory === "Todos"
      ? places_tips
      : places_tips.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const handleCopyWifi = async () => {
    if (!wifi.password) return;

    try {
      await navigator.clipboard.writeText(wifi.password);
    } catch {
      // Fallback para contextos sem clipboard API direta
      const textarea = document.createElement("textarea");
      textarea.value = wifi.password;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopiedWifi(true);
    trackGuideInteraction("copy_wifi");

    window.setTimeout(() => {
      setCopiedWifi(false);
    }, 2800);
  };

  const handleOpenMaps = () => {
    trackGuideInteraction("open_maps");
  };

  const handleOpenWaze = () => {
    trackGuideInteraction("open_waze");
  };

  const handleOpenPlaceTip = (placeName: string) => {
    trackGuideInteraction(`place_tip:${placeName}`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 1. Card de Wi-Fi com toque brand-aqua */}
      <section
        aria-label="Conexão Wi-Fi"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-aqua/75 via-brand-aqua/45 to-white border-2 border-brand-aqua p-5 shadow-sm"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 w-28 h-28 rounded-full bg-brand-green/35 blur-xl"
        />

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-navy text-white flex items-center justify-center shadow-xs">
              <Wifi className="w-5 h-5 text-brand-sun" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/70">
                Internet da Pousada
              </span>
              <h2 className="text-lg font-extrabold text-brand-navy leading-tight">
                📶 Wi-Fi para Hóspedes
              </h2>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-brand-green text-brand-navy text-xs font-bold">
            Gratuito
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div className="rounded-2xl bg-white/90 border border-brand-navy/10 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/60">
              Rede (SSID)
            </p>
            <p className="mt-0.5 font-extrabold text-base text-brand-navy break-all">
              {wifi.ssid || "Consulte a recepção"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/90 border border-brand-navy/10 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/60">
              Senha de Acesso
            </p>
            <p className="mt-0.5 font-mono font-bold text-base text-brand-navy break-all">
              {wifi.password || "—"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyWifi}
          disabled={!wifi.password}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.99] ${
            copiedWifi
              ? "bg-brand-green text-brand-navy border-2 border-brand-navy"
              : "bg-brand-navy text-white hover:bg-brand-navy-light"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {copiedWifi ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Senha copiada!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-brand-sun" />
              <span>Copiar Senha</span>
            </>
          )}
        </button>
      </section>

      {/* 2. Como Chegar & Mapas e Rotas */}
      <section
        id="como-chegar"
        aria-label="Como Chegar e Mapas"
        className="scroll-mt-4 rounded-3xl bg-white border-2 border-brand-navy/12 p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-sand/70 text-brand-navy flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/60">
              Localização & Rotas
            </span>
            <h2 className="text-lg font-extrabold text-brand-navy leading-tight">
              📍 Como Chegar
            </h2>
          </div>
        </div>

        {/* Endereço e Instruções Escritas */}
        <div className="rounded-2xl bg-brand-bg border border-brand-navy/10 p-4 space-y-2">
          {location.address && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/60">
                Endereço
              </p>
              <p className="text-sm font-bold text-brand-navy mt-0.5">
                {location.address}
              </p>
            </div>
          )}

          {location.instructions && (
            <div className="pt-1 border-t border-brand-navy/10">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/60">
                Orientações de Chegada
              </p>
              <p className="text-sm text-brand-navy/85 leading-relaxed mt-0.5 whitespace-pre-line">
                {location.instructions}
              </p>
            </div>
          )}
        </div>

        {/* Google Maps Embed (quando location.embed_url estiver preenchido) */}
        {cleanEmbedUrl && (
          <div className="overflow-hidden rounded-2xl border-2 border-brand-aqua shadow-xs bg-brand-aqua/20">
            <iframe
              src={cleanEmbedUrl}
              title="Mapa de Localização - Pousada Moradas do Gabriel"
              className="w-full h-60 sm:h-64 border-0 rounded-2xl"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {/* Dois botões de ação rápida lado a lado: Google Maps e Waze */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href={location.maps_url || "https://maps.google.com"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenMaps}
            className="flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl bg-brand-navy text-white font-bold text-xs sm:text-sm hover:bg-brand-navy-light transition-all shadow-xs active:scale-[0.98] text-center"
          >
            <MapPin className="w-4 h-4 text-brand-sun shrink-0" />
            <span>Abrir no Google Maps</span>
          </a>

          <a
            href={location.waze_url || "https://waze.com/ul"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenWaze}
            className="flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl bg-brand-aqua/80 hover:bg-brand-aqua text-brand-navy border border-brand-navy/20 font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] text-center"
          >
            <Navigation className="w-4 h-4 text-brand-navy shrink-0" />
            <span>Ir com Waze</span>
          </a>
        </div>
      </section>

      {/* 3. Regras da Hospedagem */}
      <section
        aria-label="Regras da Hospedagem"
        className="rounded-3xl bg-gradient-to-br from-brand-sand/45 via-brand-sand/20 to-white border-2 border-brand-sand p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-sun/85 text-brand-navy flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/65">
              Boa Convivência & Conforto
            </span>
            <h2 className="text-lg font-extrabold text-brand-navy leading-tight">
              📋 Regras da Hospedagem
            </h2>
          </div>
        </div>

        {rules.length > 0 ? (
          <ul className="space-y-2.5">
            {rules.map((rule, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-2xl bg-white/90 border border-brand-navy/10 p-3.5 text-sm text-brand-navy leading-relaxed"
              >
                <span className="w-6 h-6 rounded-full bg-brand-green/80 text-brand-navy font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-brand-navy/75 bg-white/80 rounded-2xl p-4">
            Aproveite sua estadia com tranquilidade! Em caso de dúvidas sobre
            horários de café da manhã ou check-out, fale com a nossa recepção.
          </p>
        )}
      </section>

      {/* 4. Dicas de Restaurantes e Lugares */}
      <section
        aria-label="Dicas de Restaurantes e Lugares"
        className="rounded-3xl bg-white border-2 border-brand-navy/12 p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-green/80 text-brand-navy flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/60">
              Curadoria da Pousada
            </span>
            <h2 className="text-lg font-extrabold text-brand-navy leading-tight">
              🍽️ Dicas de Restaurantes e Lugares
            </h2>
          </div>
        </div>

        {/* Filtro por Categoria em estilo Pílula */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-brand-bg text-brand-navy/80 border border-brand-navy/15 hover:bg-brand-aqua/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Lista de Cards de Lugares */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredPlaces.map((place, idx) => {
              const { badgeClass, icon: CategoryIcon } = getCategoryStyle(
                place.category,
              );

              return (
                <article
                  key={`${place.name}-${idx}`}
                  className="rounded-2xl bg-brand-bg/75 border border-brand-navy/12 p-4 flex flex-col justify-between gap-3 hover:border-brand-navy/30 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-extrabold text-base text-brand-navy">
                        {place.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}
                      >
                        <CategoryIcon className="w-3 h-3" />
                        {place.category}
                      </span>
                    </div>
                    {place.description && (
                      <p className="text-xs sm:text-sm text-brand-navy/80 leading-relaxed">
                        {place.description}
                      </p>
                    )}
                  </div>

                  {place.link && (
                    <div className="pt-1">
                      <a
                        href={place.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleOpenPlaceTip(place.name)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-brand-navy/20 text-brand-navy font-bold text-xs hover:bg-brand-aqua/45 hover:border-brand-navy transition-all"
                      >
                        <span>Ver localização / conhecer</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-brand-bg p-5 text-center border border-brand-navy/10">
            <p className="text-sm text-brand-navy/75">
              Nenhuma dica encontrada na categoria{" "}
              <strong className="text-brand-navy">{selectedCategory}</strong>.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
