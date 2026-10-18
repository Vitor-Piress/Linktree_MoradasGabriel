import type {
  BusinessInfoMetadata,
  Json,
  PlaceTip,
  TypedBusinessInfo,
} from "../@types/database.types";
import { supabase } from "../lib/supabase";
import { extractEmbedUrl } from "../utils/embedUrl";

export const DEFAULT_BUSINESS_METADATA: BusinessInfoMetadata = {
  wifi: {
    ssid: "MoradasDoGabriel_5G",
    password: "bemvindomoradas",
  },
  location: {
    address: "Consulte a recepção para o endereço completo da Pousada Moradas do Gabriel",
    maps_url: "https://maps.google.com",
    waze_url: "https://waze.com/ul",
    embed_url: "",
    instructions:
      "Siga pela via principal até a placa indicativa da Pousada Moradas do Gabriel. Estacionamento privativo no local.",
  },
  rules: [
    "Check-in a partir das 14h00 e Check-out até as 12h00.",
    "Café da manhã servido diariamente em ambiente acolhedor das 08h00 às 10h00.",
    "Horário de silêncio das 22h00 às 08h00 para o descanso e tranquilidade de todos.",
    "Pedimos a gentileza de desligar o ar-condicionado e as luzes ao sair da acomodação.",
    "Dúvidas, toalhas extras ou dicas de passeios? Chame nossa equipe pelo WhatsApp!",
  ],
  places_tips: [
    {
      name: "Restaurante Sabor da Praia",
      category: "Gastronomia",
      description:
        "Frutos do mar frescos, moquecas artesanais e vista encantadora para o pôr do sol.",
      link: "https://maps.google.com",
    },
    {
      name: "Praia Principal",
      category: "Praias",
      description:
        "Águas calmas e cristalinas, ideal para banho de mar, caminhadas matinais e relaxar ao sol.",
      link: "https://maps.google.com",
    },
    {
      name: "Passeio de Barco pelas Ilhas",
      category: "Passeios",
      description:
        "Roteiro imperdível pelas enseadas e piscinas naturais da região com paradas para mergulho.",
      link: "https://maps.google.com",
    },
    {
      name: "Mercadinho & Padaria Local",
      category: "Mercados",
      description:
        "Pães quentinhos, frutas frescas, bebidas, gelo e itens de conveniência pertinho da pousada.",
      link: "https://maps.google.com",
    },
  ],
  contacts: {
    whatsapp: "",
    phone: "",
    instagram: "",
  },
};

function isRecord(
  value: unknown,
): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Normaliza o objeto `metadata` vindo do banco para garantir que todos os campos
 * da interface `BusinessInfoMetadata` existam com tipagem segura.
 */
export function normalizeBusinessMetadata(
  raw: Json | null | undefined,
): BusinessInfoMetadata {
  if (!isRecord(raw)) {
    return structuredClone(DEFAULT_BUSINESS_METADATA);
  }

  const rawWifi = isRecord(raw.wifi) ? raw.wifi : {};
  const rawLocation = isRecord(raw.location) ? raw.location : {};
  const rawContacts = isRecord(raw.contacts) ? raw.contacts : {};

  const rules: string[] = Array.isArray(raw.rules)
    ? raw.rules
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : DEFAULT_BUSINESS_METADATA.rules;

  const places_tips: PlaceTip[] = Array.isArray(raw.places_tips)
    ? raw.places_tips
        .filter(isRecord)
        .map((item) => ({
          name: typeof item.name === "string" ? item.name : "",
          category:
            typeof item.category === "string" && item.category.trim()
              ? item.category.trim()
              : "Gastronomia",
          description:
            typeof item.description === "string" ? item.description : "",
          link: typeof item.link === "string" ? item.link : "",
        }))
        .filter((item) => item.name.trim() !== "")
    : DEFAULT_BUSINESS_METADATA.places_tips;

  return {
    wifi: {
      ssid:
        typeof rawWifi.ssid === "string"
          ? rawWifi.ssid
          : DEFAULT_BUSINESS_METADATA.wifi.ssid,
      password:
        typeof rawWifi.password === "string"
          ? rawWifi.password
          : DEFAULT_BUSINESS_METADATA.wifi.password,
    },
    location: {
      address:
        typeof rawLocation.address === "string"
          ? rawLocation.address
          : DEFAULT_BUSINESS_METADATA.location.address,
      maps_url:
        typeof rawLocation.maps_url === "string"
          ? rawLocation.maps_url
          : DEFAULT_BUSINESS_METADATA.location.maps_url,
      waze_url:
        typeof rawLocation.waze_url === "string"
          ? rawLocation.waze_url
          : DEFAULT_BUSINESS_METADATA.location.waze_url,
      embed_url:
        typeof rawLocation.embed_url === "string"
          ? extractEmbedUrl(rawLocation.embed_url)
          : DEFAULT_BUSINESS_METADATA.location.embed_url,
      instructions:
        typeof rawLocation.instructions === "string"
          ? rawLocation.instructions
          : DEFAULT_BUSINESS_METADATA.location.instructions,
    },
    rules,
    places_tips,
    contacts: {
      whatsapp:
        typeof rawContacts.whatsapp === "string"
          ? rawContacts.whatsapp
          : DEFAULT_BUSINESS_METADATA.contacts.whatsapp,
      phone:
        typeof rawContacts.phone === "string"
          ? rawContacts.phone
          : DEFAULT_BUSINESS_METADATA.contacts.phone,
      instagram:
        typeof rawContacts.instagram === "string"
          ? rawContacts.instagram
          : DEFAULT_BUSINESS_METADATA.contacts.instagram,
    },
  };
}

/**
 * Busca as informações do Guia do Hóspede na tabela `business_info`.
 * Caso ainda não exista registro no banco, retorna um objeto padrão seguro.
 */
export async function getBusinessInfo(): Promise<TypedBusinessInfo> {
  const { data, error } = await supabase
    .from("business_info")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(
      "[businessInfoService] Erro ao buscar business_info:",
      error.message,
    );
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      id: "",
      tab_title: "Guia do Hóspede",
      content:
        "Seja muito bem-vindo! Aqui você encontra tudo para aproveitar sua estadia com tranquilidade.",
      updated_at: new Date().toISOString(),
      metadata: structuredClone(DEFAULT_BUSINESS_METADATA),
    };
  }

  // Se houver mais de uma linha legada, consolida os metadados priorizando o registro mais recente
  const primaryRow = data[0];
  const mergedRawMetadata: Record<string, unknown> = {};

  for (let i = data.length - 1; i >= 0; i--) {
    const rowMeta = data[i].metadata;
    if (isRecord(rowMeta)) {
      Object.assign(mergedRawMetadata, rowMeta);
    }
  }

  return {
    ...primaryRow,
    tab_title: primaryRow.tab_title || "Guia do Hóspede",
    content:
      primaryRow.content ||
      "Seja muito bem-vindo! Aqui você encontra tudo para aproveitar sua estadia com tranquilidade.",
    metadata: normalizeBusinessMetadata(mergedRawMetadata as Json),
  };
}

export interface SaveBusinessInfoInput {
  id?: string;
  tab_title?: string;
  content?: string;
  metadata: BusinessInfoMetadata;
}

/**
 * Salva ou atualiza o Guia do Hóspede na tabela `business_info`.
 * Extrai automaticamente o atributo `src` caso o usuário tenha colado uma tag `<iframe>`
 * no campo `location.embed_url`.
 */
export async function saveBusinessInfo(
  input: SaveBusinessInfoInput,
): Promise<TypedBusinessInfo> {
  const sanitizedMetadata: BusinessInfoMetadata = {
    wifi: {
      ssid: input.metadata.wifi.ssid.trim(),
      password: input.metadata.wifi.password.trim(),
    },
    location: {
      address: input.metadata.location.address.trim(),
      maps_url: input.metadata.location.maps_url.trim(),
      waze_url: input.metadata.location.waze_url.trim(),
      embed_url: extractEmbedUrl(input.metadata.location.embed_url),
      instructions: input.metadata.location.instructions.trim(),
    },
    rules: input.metadata.rules.map((r) => r.trim()).filter(Boolean),
    places_tips: input.metadata.places_tips
      .map((p) => ({
        name: p.name.trim(),
        category: p.category.trim() || "Gastronomia",
        description: p.description.trim(),
        link: p.link.trim(),
      }))
      .filter((p) => p.name !== ""),
    contacts: {
      whatsapp: input.metadata.contacts.whatsapp.trim(),
      phone: input.metadata.contacts.phone.trim(),
      instagram: input.metadata.contacts.instagram.trim(),
    },
  };

  const tabTitle = (input.tab_title || "Guia do Hóspede").trim();
  const content = (
    input.content ||
    "Seja muito bem-vindo! Aqui você encontra tudo para aproveitar sua estadia com tranquilidade."
  ).trim();
  const nowIso = new Date().toISOString();

  let targetId = input.id;

  if (!targetId) {
    const { data: existing } = await supabase
      .from("business_info")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1);

    if (existing && existing.length > 0) {
      targetId = existing[0].id;
    }
  }

  if (targetId) {
    const { data, error } = await supabase
      .from("business_info")
      .update({
        tab_title: tabTitle,
        content,
        metadata: sanitizedMetadata as unknown as Json,
        updated_at: nowIso,
      })
      .eq("id", targetId)
      .select()
      .single();

    if (error) {
      console.error(
        "[businessInfoService] Erro ao atualizar business_info:",
        error.message,
      );
      throw error;
    }

    return {
      ...data,
      metadata: normalizeBusinessMetadata(data.metadata),
    };
  }

  const { data, error } = await supabase
    .from("business_info")
    .insert({
      tab_title: tabTitle,
      content,
      metadata: sanitizedMetadata as unknown as Json,
      updated_at: nowIso,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "[businessInfoService] Erro ao criar business_info:",
      error.message,
    );
    throw error;
  }

  return {
    ...data,
    metadata: normalizeBusinessMetadata(data.metadata),
  };
}
