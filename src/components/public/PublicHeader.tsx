import { Camera, MapPin, MessageCircle, Sun } from "lucide-react";
import type { ContactsMetadata, LinkRow } from "../../@types/database.types";
import logoMoradas from "../../assets/logoMoradasdoGabriel.png";
import { trackGuideInteraction, trackLinkClick } from "../../services";
import { formatInstagramUrl, formatWhatsAppUrl } from "../../utils/embedUrl";

interface PublicHeaderProps {
  welcomeMessage: string;
  contacts: ContactsMetadata;
  links: LinkRow[];
  onNavigateToLocation: () => void;
}

export function PublicHeader({
  welcomeMessage,
  contacts,
  links,
  onNavigateToLocation,
}: PublicHeaderProps) {
  // Resolve WhatsApp URL a partir de contacts.whatsapp ou de um link cadastrado
  const fallbackWhatsappLink = links.find(
    (l) =>
      l.title.toLowerCase().includes("whatsapp") ||
      l.url.toLowerCase().includes("wa.me") ||
      l.url.toLowerCase().includes("whatsapp"),
  );
  const whatsappHref =
    formatWhatsAppUrl(contacts.whatsapp) ||
    fallbackWhatsappLink?.url ||
    "https://wa.me/";

  // Resolve Instagram URL a partir de contacts.instagram ou de um link cadastrado
  const fallbackInstagramLink = links.find(
    (l) =>
      l.title.toLowerCase().includes("instagram") ||
      l.url.toLowerCase().includes("instagram.com"),
  );
  const instagramHref =
    formatInstagramUrl(contacts.instagram) ||
    fallbackInstagramLink?.url ||
    "https://instagram.com";

  const handleWhatsAppClick = () => {
    trackLinkClick(fallbackWhatsappLink?.id ?? null, "quick_whatsapp");
  };

  const handleInstagramClick = () => {
    trackLinkClick(fallbackInstagramLink?.id ?? null, "quick_instagram");
  };

  const handleLocationClick = () => {
    trackGuideInteraction("quick_location");
    onNavigateToLocation();
  };

  return (
    <header className="relative pt-7 pb-5 px-4 text-center">
      {/* Detalhe decorativo solar/costeiro de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-brand-aqua/45 via-brand-sand/20 to-transparent rounded-b-[2.5rem] -z-10"
      />

      {/* Container da Logo Oficial (fundo branco conforme identidade) */}
      <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white shadow-md shadow-brand-navy/8 border-2 border-brand-aqua/80 p-2.5 flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
        <img
          src={logoMoradas}
          alt="Logo Pousada Moradas do Gabriel"
          className="w-full h-full object-contain rounded-2xl"
        />
        <span
          title="Hospitalidade Solar"
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-sun text-brand-navy flex items-center justify-center shadow-sm border-2 border-white"
        >
          <Sun className="w-4 h-4 fill-brand-navy/15" />
        </span>
      </div>

      {/* Badge sutil */}
      <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/60 text-brand-navy text-xs font-semibold tracking-wide">
        <span className="w-2 h-2 rounded-full bg-brand-navy animate-pulse" />
        Central Digital do Hóspede
      </div>

      {/* Título Principal */}
      <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-navy">
        Moradas do Gabriel
      </h1>

      {/* Mensagem Receptiva */}
      <p className="mt-1.5 text-sm sm:text-base text-brand-navy/80 max-w-sm mx-auto leading-relaxed">
        {welcomeMessage ||
          "Seja muito bem-vindo! Aqui você encontra nossos links rápidos e o guia completo para aproveitar sua estadia."}
      </p>

      {/* Ícones Rápidos (WhatsApp, Instagram, Como Chegar) */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          aria-label="Falar no WhatsApp"
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-brand-navy/15 text-brand-navy text-xs sm:text-sm font-semibold shadow-xs hover:bg-brand-green/50 hover:border-brand-navy/30 transition-all active:scale-95"
        >
          <span className="w-7 h-7 rounded-xl bg-brand-green/70 text-brand-navy flex items-center justify-center group-hover:bg-brand-green transition-colors">
            <MessageCircle className="w-4 h-4" />
          </span>
          <span>WhatsApp</span>
        </a>

        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInstagramClick}
          aria-label="Visitar Instagram"
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-brand-navy/15 text-brand-navy text-xs sm:text-sm font-semibold shadow-xs hover:bg-brand-sand/50 hover:border-brand-navy/30 transition-all active:scale-95"
        >
          <span className="w-7 h-7 rounded-xl bg-brand-sand/70 text-brand-navy flex items-center justify-center group-hover:bg-brand-sand transition-colors">
            <Camera className="w-4 h-4" />
          </span>
          <span>Instagram</span>
        </a>

        <button
          type="button"
          onClick={handleLocationClick}
          aria-label="Como Chegar"
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-brand-navy/15 text-brand-navy text-xs sm:text-sm font-semibold shadow-xs hover:bg-brand-aqua/60 hover:border-brand-navy/30 transition-all active:scale-95"
        >
          <span className="w-7 h-7 rounded-xl bg-brand-aqua/80 text-brand-navy flex items-center justify-center group-hover:bg-brand-aqua transition-colors">
            <MapPin className="w-4 h-4" />
          </span>
          <span>Como Chegar</span>
        </button>
      </div>
    </header>
  );
}
