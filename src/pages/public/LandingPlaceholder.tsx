import {
  ArrowLeft,
  BedDouble,
  Coffee,
  Compass,
  MapPin,
  MessageCircle,
  Sparkles,
  Sun,
  Waves,
  Wifi,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import logoMoradas from "../../assets/logoMoradasdoGabriel.png";
import { useBusinessInfo } from "../../hooks/usePortalData";
import {
  DEFAULT_BUSINESS_METADATA,
  trackLinkClick,
  trackPageView,
} from "../../services";
import { formatWhatsAppUrl } from "../../utils/embedUrl";

export function LandingPlaceholder() {
  const { data: businessInfo } = useBusinessInfo();
  const metadata = businessInfo?.metadata ?? DEFAULT_BUSINESS_METADATA;

  useEffect(() => {
    trackPageView("site_placeholder");
  }, []);

  const whatsappUrl =
    formatWhatsAppUrl(
      metadata.contacts.whatsapp,
      "Olá! Vim pelo site da Pousada Moradas do Gabriel e gostaria de consultar disponibilidade de hospedagem.",
    ) || "https://wa.me/";

  const highlights = [
    {
      icon: BedDouble,
      title: "Acomodações Aconchegantes",
      description:
        "Ambientes pensados para o seu descanso com charme costeiro e todo o conforto que você merece.",
      bg: "bg-brand-aqua/45 border-brand-aqua",
    },
    {
      icon: Sun,
      title: "Clima Solar & Natureza",
      description:
        "Pertinho do mar e cercada pela brisa suave da região para dias inesquecíveis.",
      bg: "bg-brand-sand/45 border-brand-sand",
    },
    {
      icon: Coffee,
      title: "Hospitalidade Acolhedora",
      description:
        "Atendimento próximo e cuidadoso para que você se sinta em casa desde o primeiro instante.",
      bg: "bg-brand-green/45 border-brand-green",
    },
    {
      icon: Wifi,
      title: "Estrutura & Praticidade",
      description:
        "Wi-Fi rápido, localização privilegiada e curadoria completa com as melhores dicas locais.",
      bg: "bg-brand-aqua/35 border-brand-aqua",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between">
      {/* Decoração Superior */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-aqua/50 via-brand-sand/20 to-transparent -z-10"
      />

      <div className="w-full max-w-3xl mx-auto px-4 pt-6 pb-12">
        {/* Barra Superior de Navegação */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-navy/15 text-brand-navy text-xs sm:text-sm font-bold shadow-xs hover:bg-brand-aqua/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Central do Hóspede</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sun/80 text-brand-navy text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            Novo Site em Breve
          </span>
        </div>

        {/* Card Hero Principal */}
        <section className="rounded-[2rem] bg-white border-2 border-brand-aqua/80 p-6 sm:p-10 shadow-md shadow-brand-navy/5 text-center relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 w-44 h-44 rounded-full bg-brand-sun/20 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-brand-aqua/40 blur-2xl"
          />

          <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white border-2 border-brand-aqua/70 p-3 shadow-sm flex items-center justify-center">
            <img
              src={logoMoradas}
              alt="Logo Pousada Moradas do Gabriel"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-green/70 text-brand-navy text-xs font-extrabold uppercase tracking-wider">
            <Waves className="w-3.5 h-3.5" />
            Pousada Moradas do Gabriel
          </div>

          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Nosso novo site completo está sendo preparado com carinho!
          </h1>

          <p className="mt-3 text-sm sm:text-base text-brand-navy/80 max-w-xl mx-auto leading-relaxed">
            Em breve você poderá explorar todas as nossas acomodações, galeria
            de fotos e experiências diretamente por aqui. Enquanto isso, nossa
            equipe está pronta para atender você e a nossa{" "}
            <strong className="text-brand-navy">Central do Hóspede</strong> já
            está 100% disponível!
          </p>

          {/* Ações Principais */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLinkClick(null, "landing_whatsapp_cta")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-brand-navy text-white font-bold text-sm hover:bg-brand-navy-light transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-brand-green" />
              <span>Falar com a Recepção / Reservar</span>
            </a>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-aqua/70 hover:bg-brand-aqua text-brand-navy font-bold text-sm border border-brand-navy/15 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Acessar Guia & Links Rápidos</span>
            </Link>
          </div>
        </section>

        {/* Destaques da Pousada */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-3xl border-2 p-5 ${item.bg} transition-transform hover:-translate-y-0.5`}
              >
                <div className="w-10 h-10 rounded-2xl bg-white text-brand-navy flex items-center justify-center shadow-2xs mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-base text-brand-navy">
                  {item.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-brand-navy/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Localização Rápida */}
        {metadata.location.address && (
          <div className="mt-6 rounded-3xl bg-white border border-brand-navy/12 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-brand-sand/70 text-brand-navy flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/60">
                  Onde Estamos
                </p>
                <p className="text-sm font-bold text-brand-navy">
                  {metadata.location.address}
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="text-xs font-extrabold text-brand-navy underline underline-offset-4 hover:text-brand-navy-light shrink-0"
            >
              Ver mapa na Central do Hóspede →
            </Link>
          </div>
        )}
      </div>

      <footer className="py-6 text-center text-xs font-semibold text-brand-navy/65 border-t border-brand-navy/10">
        © {new Date().getFullYear()} Pousada Moradas do Gabriel
      </footer>
    </div>
  );
}
