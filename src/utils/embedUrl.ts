/**
 * Extrai apenas a URL do atributo `src` caso o usuário cole a tag `<iframe ...>`
 * completa do Google Maps Embed, ou retorna a própria URL limpa.
 */
export function extractEmbedUrl(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // Verifica se contém uma tag <iframe ... src="..."> ou src='...'
  const srcMatch = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1].replace(/&amp;/g, "&").trim();
  }

  // Fallback caso tenha apenas src="..." avulso
  const fallbackMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (fallbackMatch && fallbackMatch[1]) {
    return fallbackMatch[1].replace(/&amp;/g, "&").trim();
  }

  return trimmed;
}

/**
 * Verifica se o input continha uma tag <iframe> antes da extração
 */
export function containsIframeTag(input: string): boolean {
  return /<iframe/i.test(input);
}

/**
 * Formata um número de telefone/WhatsApp ou link para URL oficial wa.me
 */
export function formatWhatsAppUrl(
  whatsappInput: string,
  defaultMessage = "Olá! Estou na Central do Hóspede da Pousada Moradas do Gabriel e gostaria de mais informações.",
): string {
  const trimmed = (whatsappInput || "").trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  const normalized =
    digits.length <= 11 && !digits.startsWith("55") ? `55${digits}` : digits;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(defaultMessage)}`;
}

/**
 * Formata um @usuario ou link do Instagram para URL completa
 */
export function formatInstagramUrl(instagramInput: string): string {
  const trimmed = (instagramInput || "").trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const handle = trimmed.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

