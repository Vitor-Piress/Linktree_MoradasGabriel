import {
  ArrowRight,
  Compass,
  ExternalLink,
  Phone,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ContactsMetadata, LinkRow } from "../../@types/database.types";
import { trackLinkClick } from "../../services";
import { resolveLinkIcon } from "../../utils/iconMapper";

interface LinksTabProps {
  links: LinkRow[];
  isLoading: boolean;
  contacts: ContactsMetadata;
  onSwitchToGuide: () => void;
}

export function LinksTab({
  links,
  isLoading,
  contacts,
  onSwitchToGuide,
}: LinksTabProps) {
  const handleExternalLinkClick = (link: LinkRow) => {
    trackLinkClick(link.id, link.title);
  };

  const handleSiteClick = () => {
    trackLinkClick(null, "site_institucional");
  };

  return (
    <div className="space-y-3.5 animate-fade-in">
      {/* Botão Especial: Conhecer a Pousada (/site) */}
      <Link
        to="/site"
        onClick={handleSiteClick}
        className="group relative overflow-hidden flex items-center justify-between gap-3 w-full p-4 rounded-2xl bg-brand-navy text-white shadow-md shadow-brand-navy/15 border border-brand-navy hover:bg-brand-navy-light transition-all duration-200 active:scale-[0.99]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 w-28 h-28 rounded-full bg-brand-sun/20 blur-xl group-hover:bg-brand-sun/30 transition-colors"
        />
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-brand-sun text-brand-navy flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left min-w-0">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-brand-green">
              Site Oficial
            </span>
            <p className="text-base font-bold text-white truncate">
              Conheça a Pousada Moradas do Gabriel
            </p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 group-hover:bg-white/20 transition-all">
          <ArrowRight className="w-4 h-4 text-brand-sun" />
        </div>
      </Link>

      {/* Estado de Carregamento */}
      {isLoading && (
        <div className="space-y-3 py-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 rounded-2xl bg-brand-aqua/30 animate-pulse border border-brand-aqua/50"
            />
          ))}
        </div>
      )}

      {/* Lista de Links Ativos ordenados por position */}
      {!isLoading && links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => {
            const IconComponent = resolveLinkIcon(
              link.icon,
              link.title,
              link.url,
            );
            const isInternal = link.url.startsWith("/");

            if (isInternal) {
              return (
                <Link
                  key={link.id}
                  to={link.url}
                  onClick={() => handleExternalLinkClick(link)}
                  className="group flex items-center justify-between gap-3 w-full p-4 rounded-2xl bg-white border-2 border-brand-navy/12 text-brand-navy shadow-xs hover:border-brand-navy hover:bg-brand-aqua/25 transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-brand-aqua/65 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-green transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm sm:text-base text-brand-navy text-left truncate">
                      {link.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-navy/50 group-hover:text-brand-navy group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            }

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLinkClick(link)}
                className="group flex items-center justify-between gap-3 w-full p-4 rounded-2xl bg-white border-2 border-brand-navy/12 text-brand-navy shadow-xs hover:border-brand-navy hover:bg-brand-aqua/25 transition-all duration-200 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-brand-aqua/65 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-green transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-brand-navy text-left truncate">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-brand-navy/45 group-hover:text-brand-navy group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>
            );
          })}
        </div>
      )}

      {/* Caso não haja links cadastrados no momento */}
      {!isLoading && links.length === 0 && (
        <div className="rounded-2xl bg-brand-aqua/25 border border-brand-aqua p-5 text-center">
          <p className="text-sm font-medium text-brand-navy/80">
            Utilize os botões rápidos acima ou explore o nosso{" "}
            <strong className="font-bold text-brand-navy">
              Guia do Hóspede
            </strong>{" "}
            para informações de Wi-Fi, mapas e dicas locais.
          </p>
        </div>
      )}

      {/* Card convite para o Guia do Hóspede */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSwitchToGuide}
          className="w-full p-4 rounded-2xl bg-brand-sand/45 hover:bg-brand-sand/70 border border-brand-sand text-brand-navy flex items-center justify-between gap-3 transition-all text-left group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-sun/80 text-brand-navy flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/70">
                Já está hospedado conosco?
              </p>
              <p className="text-sm font-bold text-brand-navy">
                Acesse a senha do Wi-Fi, mapas e dicas locais
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-brand-navy shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Telefone direto se preenchido */}
      {contacts.phone && (
        <div className="pt-1 text-center">
          <a
            href={`tel:${contacts.phone.replace(/\D/g, "")}`}
            onClick={() => trackLinkClick(null, "phone_contact")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy/75 hover:text-brand-navy py-1.5 px-3 rounded-full bg-white/80 border border-brand-navy/10"
          >
            <Phone className="w-3.5 h-3.5 text-brand-navy" />
            <span>Recepção: {contacts.phone}</span>
          </a>
        </div>
      )}
    </div>
  );
}
