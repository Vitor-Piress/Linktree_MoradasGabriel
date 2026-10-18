import {
  Check,
  ClipboardCheck,
  Loader2,
  MapPin,
  MessageCircle,
  Plus,
  Save,
  Sparkles,
  Sun,
  Trash2,
  Wifi,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import type {
  BusinessInfoMetadata,
  PlaceTip,
  TypedBusinessInfo,
} from "../../@types/database.types";
import { useSaveBusinessInfo } from "../../hooks/usePortalData";
import { DEFAULT_BUSINESS_METADATA } from "../../services";
import { containsIframeTag, extractEmbedUrl } from "../../utils/embedUrl";

interface GuestGuideEditorProps {
  businessInfo: TypedBusinessInfo | undefined;
}

const PLACE_CATEGORY_OPTIONS = [
  "Gastronomia",
  "Praias",
  "Passeios",
  "Mercados",
] as const;

export function GuestGuideEditor({ businessInfo }: GuestGuideEditorProps) {
  const saveMutation = useSaveBusinessInfo();

  const initialMeta: BusinessInfoMetadata =
    businessInfo?.metadata ?? DEFAULT_BUSINESS_METADATA;

  const [welcomeContent, setWelcomeContent] = useState(
    businessInfo?.content ??
      "Seja muito bem-vindo! Aqui você encontra nossos links rápidos e o guia completo para aproveitar sua estadia.",
  );

  // Contatos Rápidos
  const [whatsapp, setWhatsapp] = useState(initialMeta.contacts.whatsapp);
  const [phone, setPhone] = useState(initialMeta.contacts.phone);
  const [instagram, setInstagram] = useState(initialMeta.contacts.instagram);

  // Wi-Fi
  const [wifiSsid, setWifiSsid] = useState(initialMeta.wifi.ssid);
  const [wifiPassword, setWifiPassword] = useState(initialMeta.wifi.password);

  // Localização & Mapas
  const [address, setAddress] = useState(initialMeta.location.address);
  const [instructions, setInstructions] = useState(
    initialMeta.location.instructions,
  );
  const [mapsUrl, setMapsUrl] = useState(initialMeta.location.maps_url);
  const [wazeUrl, setWazeUrl] = useState(initialMeta.location.waze_url);
  const [embedUrl, setEmbedUrl] = useState(initialMeta.location.embed_url);
  const [iframeExtractedNotice, setIframeExtractedNotice] = useState(false);

  // Regras da Hospedagem
  const [rules, setRules] = useState<string[]>(initialMeta.rules);
  const [newRule, setNewRule] = useState("");

  // Dicas de Lugares
  const [placesTips, setPlacesTips] = useState<PlaceTip[]>(
    initialMeta.places_tips,
  );
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] =
    useState<string>("Gastronomia");
  const [newPlaceDescription, setNewPlaceDescription] = useState("");
  const [newPlaceLink, setNewPlaceLink] = useState("");

  // Feedback de salvamento
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleEmbedUrlChange = (rawInput: string) => {
    if (containsIframeTag(rawInput)) {
      const extracted = extractEmbedUrl(rawInput);
      setEmbedUrl(extracted);
      setIframeExtractedNotice(true);
    } else {
      setEmbedUrl(rawInput);
      setIframeExtractedNotice(false);
    }
  };

  // Funções de Regras
  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setRules((prev) => [...prev, newRule.trim()]);
    setNewRule("");
  };

  const handleUpdateRule = (index: number, value: string) => {
    setRules((prev) => prev.map((r, i) => (i === index ? value : r)));
  };

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  // Funções de Dicas de Lugares
  const handleAddPlace = () => {
    if (!newPlaceName.trim()) return;
    const item: PlaceTip = {
      name: newPlaceName.trim(),
      category: newPlaceCategory || "Gastronomia",
      description: newPlaceDescription.trim(),
      link: newPlaceLink.trim(),
    };
    setPlacesTips((prev) => [...prev, item]);
    setNewPlaceName("");
    setNewPlaceCategory("Gastronomia");
    setNewPlaceDescription("");
    setNewPlaceLink("");
  };

  const handleUpdatePlace = (
    index: number,
    field: keyof PlaceTip,
    value: string,
  ) => {
    setPlacesTips((prev) =>
      prev.map((place, i) =>
        i === index ? { ...place, [field]: value } : place,
      ),
    );
  };

  const handleRemovePlace = (index: number) => {
    setPlacesTips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    const cleanedEmbedUrl = extractEmbedUrl(embedUrl);
    setEmbedUrl(cleanedEmbedUrl);

    try {
      await saveMutation.mutateAsync({
        id: businessInfo?.id || undefined,
        tab_title: businessInfo?.tab_title || "Guia do Hóspede",
        content: welcomeContent.trim(),
        metadata: {
          wifi: {
            ssid: wifiSsid.trim(),
            password: wifiPassword.trim(),
          },
          location: {
            address: address.trim(),
            maps_url: mapsUrl.trim(),
            waze_url: wazeUrl.trim(),
            embed_url: cleanedEmbedUrl,
            instructions: instructions.trim(),
          },
          rules: rules.map((r) => r.trim()).filter(Boolean),
          places_tips: placesTips
            .map((p) => ({
              name: p.name.trim(),
              category: p.category.trim() || "Gastronomia",
              description: p.description.trim(),
              link: p.link.trim(),
            }))
            .filter((p) => p.name !== ""),
          contacts: {
            whatsapp: whatsapp.trim(),
            phone: phone.trim(),
            instagram: instagram.trim(),
          },
        },
      });

      setSaveSuccess(true);
      window.setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar alterações do Guia do Hóspede.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Barra de Ação Fixa/Superior de Salvamento */}
      <div className="sticky top-3 z-20 rounded-2xl bg-brand-navy text-white p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-sun" />
            <span>Editor do Guia do Hóspede (Central Digital)</span>
          </h3>
          <p className="text-xs text-white/75">
            Edite Wi-Fi, mapas, regras e dicas locais e clique em Salvar
          </p>
        </div>

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-sun hover:bg-brand-green text-brand-navy font-extrabold text-xs sm:text-sm transition-all shadow-xs shrink-0 disabled:opacity-60"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Alterações Salvas!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Salvar Guia do Hóspede</span>
            </>
          )}
        </button>
      </div>

      {saveError && (
        <div className="rounded-2xl bg-brand-sand border border-brand-navy/30 p-4 text-xs sm:text-sm font-bold text-brand-navy">
          Erro ao salvar: {saveError}
        </div>
      )}

      {/* 1. Boas-vindas & Contatos Rápidos do Header */}
      <section className="rounded-3xl bg-white border-2 border-brand-navy/12 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-green/80 text-brand-navy flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-brand-navy">
              Boas-Vindas & Contatos Rápidos
            </h4>
            <p className="text-xs text-brand-navy/65">
              Mensagem exibida no topo da página e atalhos rápidos do cabeçalho
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
            Mensagem Receptiva do Cabeçalho
          </label>
          <textarea
            rows={2}
            value={welcomeContent}
            onChange={(e) => setWelcomeContent(e.target.value)}
            placeholder="Seja muito bem-vindo à Pousada Moradas do Gabriel!"
            className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
              WhatsApp (DDD + Número ou Link)
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: 5548999999999"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
              Telefone da Recepção
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: (48) 99999-9999"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
              Instagram (@usuario ou URL)
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Ex: @moradasdogabriel"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
            />
          </div>
        </div>
      </section>

      {/* 2. Configurações de Wi-Fi */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-aqua/40 to-white border-2 border-brand-aqua p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-navy text-brand-sun flex items-center justify-center">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-brand-navy">
              📶 Wi-Fi da Pousada
            </h4>
            <p className="text-xs text-brand-navy/65">
              Exibido em destaque com botão de copiar senha em 1 toque
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
              Nome da Rede (SSID)
            </label>
            <input
              type="text"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="Ex: MoradasDoGabriel_5G"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
              Senha do Wi-Fi
            </label>
            <input
              type="text"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="Digite a senha do Wi-Fi"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-brand-navy/20 text-sm font-mono text-brand-navy focus:outline-none focus:border-brand-navy"
            />
          </div>
        </div>
      </section>

      {/* 3. Como Chegar, Endereço e Google Maps Embed */}
      <section className="rounded-3xl bg-white border-2 border-brand-navy/12 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-sand/80 text-brand-navy flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-brand-navy">
              📍 Como Chegar & Mapas
            </h4>
            <p className="text-xs text-brand-navy/65">
              Endereço, instruções, links do Google Maps/Waze e mapa interativo
              incorporado
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
            Endereço Completo
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rua..., Nº..., Bairro, Cidade - UF"
            className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
            Instruções e Pontos de Referência
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Orientações úteis para a chegada do hóspede..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
              Link do Botão &ldquo;Abrir no Google Maps&rdquo;
            </label>
            <input
              type="text"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
              Link do Botão &ldquo;Ir com Waze&rdquo;
            </label>
            <input
              type="text"
              value={wazeUrl}
              onChange={(e) => setWazeUrl(e.target.value)}
              placeholder="https://waze.com/ul/..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy/75 mb-1">
            Google Maps Embed (URL ou código &lt;iframe src=&quot;...&quot;&gt;)
          </label>
          <input
            type="text"
            value={embedUrl}
            onChange={(e) => handleEmbedUrlChange(e.target.value)}
            placeholder='Cole a URL de embed ou o código <iframe src="https://www.google.com/maps/embed?pb=..." /> completo'
            className="w-full px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
          />
          <p className="mt-1 text-[11px] text-brand-navy/65">
            Dica: No Google Maps, clique em{" "}
            <strong>Compartilhar → Incorporar um mapa</strong> e cole o código{" "}
            <code>&lt;iframe&gt;</code> inteiro aqui — extraímos apenas a URL do{" "}
            <code>src</code> automaticamente!
          </p>

          {iframeExtractedNotice && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/80 text-brand-navy text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>
                Tag &lt;iframe&gt; detectada! Extraímos automaticamente a URL do
                atributo src.
              </span>
            </div>
          )}

          {embedUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border-2 border-brand-aqua bg-brand-aqua/20">
              <iframe
                src={extractEmbedUrl(embedUrl)}
                title="Preview do Google Maps Embed"
                className="w-full h-48 border-0 rounded-2xl"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. Gerenciador de Regras da Hospedagem */}
      <section className="rounded-3xl bg-white border-2 border-brand-sand p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-sun/85 text-brand-navy flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-brand-navy">
              📋 Gerenciador de Regras da Hospedagem ({rules.length})
            </h4>
            <p className="text-xs text-brand-navy/65">
              Adicione, edite ou remova as orientações da estadia
            </p>
          </div>
        </div>

        {/* Adicionar Nova Regra */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddRule();
              }
            }}
            placeholder="Digite uma nova regra ou orientação (ex: Check-in às 14h)..."
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-navy/20 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
          />
          <button
            type="button"
            onClick={handleAddRule}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-navy text-white text-xs sm:text-sm font-bold hover:bg-brand-navy-light transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-brand-sun" />
            <span>Adicionar Regra</span>
          </button>
        </div>

        {/* Lista de Regras */}
        <div className="space-y-2.5">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 rounded-2xl bg-brand-bg/70 border border-brand-navy/12 p-2.5"
            >
              <span className="w-6 h-6 rounded-full bg-brand-green/80 text-brand-navy text-xs font-extrabold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <input
                type="text"
                value={rule}
                onChange={(e) => handleUpdateRule(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-brand-navy/15 text-sm text-brand-navy focus:outline-none focus:border-brand-navy"
              />
              <button
                type="button"
                onClick={() => handleRemoveRule(idx)}
                title="Remover regra"
                className="p-2 rounded-xl bg-white border border-brand-navy/15 text-brand-navy/70 hover:bg-brand-sand hover:text-brand-navy transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Gerenciador de Dicas de Restaurantes e Lugares */}
      <section className="rounded-3xl bg-white border-2 border-brand-navy/12 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-green/85 text-brand-navy flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-brand-navy">
              🍽️ Gerenciador de Dicas de Lugares ({placesTips.length})
            </h4>
            <p className="text-xs text-brand-navy/65">
              Cadastre recomendações de Gastronomia, Praias, Passeios e Mercados
            </p>
          </div>
        </div>

        {/* Sub-formulário para adicionar novo lugar */}
        <div className="rounded-2xl bg-brand-aqua/25 border border-brand-aqua p-4 space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand-navy">
            Adicionar Nova Recomendação
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              placeholder="Nome do Lugar *"
              className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-white border border-brand-navy/20 text-sm text-brand-navy"
            />
            <select
              value={newPlaceCategory}
              onChange={(e) => setNewPlaceCategory(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white border border-brand-navy/20 text-sm text-brand-navy"
            >
              {PLACE_CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newPlaceDescription}
              onChange={(e) => setNewPlaceDescription(e.target.value)}
              placeholder="Descrição curta (ex: Ótima moqueca à beira-mar)"
              className="px-3.5 py-2 rounded-xl bg-white border border-brand-navy/20 text-sm text-brand-navy"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlaceLink}
                onChange={(e) => setNewPlaceLink(e.target.value)}
                placeholder="Link do Maps ou Instagram"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-brand-navy/20 text-sm text-brand-navy"
              />
              <button
                type="button"
                onClick={handleAddPlace}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-all shrink-0"
              >
                <Plus className="w-4 h-4 text-brand-sun" />
                <span>Incluir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista Editável de Lugares */}
        <div className="space-y-3">
          {placesTips.map((place, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-brand-bg/75 border border-brand-navy/15 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-brand-navy/70">
                  Dica #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePlace(idx)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy/70 hover:text-brand-navy px-2.5 py-1 rounded-lg bg-white border border-brand-navy/15"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={place.name}
                  onChange={(e) =>
                    handleUpdatePlace(idx, "name", e.target.value)
                  }
                  placeholder="Nome do lugar"
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-brand-navy/20 text-sm font-bold text-brand-navy"
                />
                <select
                  value={place.category}
                  onChange={(e) =>
                    handleUpdatePlace(idx, "category", e.target.value)
                  }
                  className="px-3 py-2 rounded-xl bg-white border border-brand-navy/20 text-sm text-brand-navy"
                >
                  {PLACE_CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={place.description}
                  onChange={(e) =>
                    handleUpdatePlace(idx, "description", e.target.value)
                  }
                  placeholder="Descrição curta"
                  className="px-3 py-2 rounded-xl bg-white border border-brand-navy/20 text-sm text-brand-navy"
                />
                <input
                  type="text"
                  value={place.link}
                  onChange={(e) =>
                    handleUpdatePlace(idx, "link", e.target.value)
                  }
                  placeholder="Link (Google Maps / Instagram)"
                  className="px-3 py-2 rounded-xl bg-white border border-brand-navy/20 text-sm text-brand-navy"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botão Final de Salvar */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-navy hover:bg-brand-navy-light text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-60"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando alterações...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-brand-sun" />
              <span>Salvar Todas as Alterações do Guia</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
