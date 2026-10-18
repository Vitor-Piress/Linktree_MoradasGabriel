import {
  BedDouble,
  Calendar,
  Camera,
  Coffee,
  Compass,
  ExternalLink,
  Globe,
  Heart,
  Home,
  Info,
  KeyRound,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Palmtree,
  Phone,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Umbrella,
  Utensils,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export interface IconOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const AVAILABLE_LINK_ICONS: IconOption[] = [
  { value: "whatsapp", label: "WhatsApp / Atendimento", icon: MessageCircle },
  { value: "calendar", label: "Reservas / Calendário", icon: Calendar },
  { value: "bed", label: "Acomodações / Suítes", icon: BedDouble },
  { value: "instagram", label: "Instagram", icon: Camera },
  { value: "map-pin", label: "Localização / Mapa", icon: MapPin },
  { value: "globe", label: "Site Oficial / Web", icon: Globe },
  { value: "phone", label: "Telefone", icon: Phone },
  { value: "sun", label: "Sol / Praia", icon: Sun },
  { value: "waves", label: "Mar / Experiências", icon: Waves },
  { value: "palmtree", label: "Natureza / Pousada", icon: Palmtree },
  { value: "utensils", label: "Gastronomia / Café", icon: Utensils },
  { value: "coffee", label: "Café da Manhã", icon: Coffee },
  { value: "compass", label: "Passeios / Guia", icon: Compass },
  { value: "camera", label: "Fotos / Tour", icon: Camera },
  { value: "star", label: "Avaliações / Destaque", icon: Star },
  { value: "sparkles", label: "Especial / Novidade", icon: Sparkles },
  { value: "heart", label: "Favorito / Bem-estar", icon: Heart },
  { value: "wifi", label: "Wi-Fi", icon: Wifi },
  { value: "key", label: "Check-in / Chave", icon: KeyRound },
  { value: "mail", label: "E-mail", icon: Mail },
  { value: "link", label: "Link Padrão", icon: LinkIcon },
];

const ICON_MAP: Record<string, LucideIcon> = {
  whatsapp: MessageCircle,
  "message-circle": MessageCircle,
  messagecircle: MessageCircle,
  calendar: Calendar,
  bed: BedDouble,
  "bed-double": BedDouble,
  instagram: Camera,
  "map-pin": MapPin,
  mappin: MapPin,
  map: MapPin,
  navigation: Navigation,
  globe: Globe,
  site: Globe,
  home: Home,
  phone: Phone,
  sun: Sun,
  umbrella: Umbrella,
  waves: Waves,
  palmtree: Palmtree,
  utensils: Utensils,
  coffee: Coffee,
  compass: Compass,
  camera: Camera,
  star: Star,
  sparkles: Sparkles,
  heart: Heart,
  wifi: Wifi,
  key: KeyRound,
  mail: Mail,
  shopping: ShoppingBag,
  info: Info,
  link: LinkIcon,
  external: ExternalLink,
};

/**
 * Resolve o ícone Lucide ideal a partir do campo `icon` salvo no banco,
 * ou infere pelo título/URL caso `icon` esteja vazio.
 */
export function resolveLinkIcon(
  iconName?: string | null,
  title?: string,
  url?: string,
): LucideIcon {
  if (iconName) {
    const key = iconName.toLowerCase().trim();
    if (ICON_MAP[key]) {
      return ICON_MAP[key];
    }
  }

  const combined = `${title || ""} ${url || ""}`.toLowerCase();
  if (
    combined.includes("whatsapp") ||
    combined.includes("wa.me") ||
    combined.includes("atendimento") ||
    combined.includes("recepção")
  ) {
    return MessageCircle;
  }
  if (combined.includes("instagram") || combined.includes("insta")) {
    return Camera;
  }
  if (
    combined.includes("reserva") ||
    combined.includes("booking") ||
    combined.includes("disponibilidade")
  ) {
    return Calendar;
  }
  if (
    combined.includes("suíte") ||
    combined.includes("suite") ||
    combined.includes("quarto") ||
    combined.includes("acomoda")
  ) {
    return BedDouble;
  }
  if (
    combined.includes("mapa") ||
    combined.includes("localiza") ||
    combined.includes("chegar") ||
    combined.includes("waze") ||
    combined.includes("maps")
  ) {
    return MapPin;
  }
  if (combined.includes("avali") || combined.includes("google") || combined.includes("review")) {
    return Star;
  }
  if (combined.includes("passeio") || combined.includes("roteiro") || combined.includes("praia")) {
    return Compass;
  }
  if (combined.includes("restaurante") || combined.includes("cardápio") || combined.includes("menu")) {
    return Utensils;
  }
  if (combined.includes("site") || combined.includes("pousada")) {
    return Globe;
  }

  return LinkIcon;
}
