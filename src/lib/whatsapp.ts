export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Tudo bem? Aqui é o Daniel do Projeto. Já fez o download do e-book/landing? Vou deixar o link aqui para você:";

/**
 * Limpa um número de telefone/whatsapp:
 * - remove tudo que não é dígito
 * - remove código do país (55) se presente
 * - remove o "0" extra do DDD (ex.: "011 96406-8875" -> "11964068875")
 */
export function sanitizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("55")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length > 11) digits = digits.slice(1);

  if (digits.length < 10 || digits.length > 11) return "";
  return digits;
}

export function buildWhatsAppUrl(
  phone: string,
  message?: string | null,
): string | null {
  const digits = sanitizePhone(phone);
  if (!digits) return null;

  const base = `https://wa.me/55${digits}`;
  const cleanMessage = (message ?? "").trim();
  return cleanMessage
    ? `${base}?text=${encodeURIComponent(cleanMessage)}`
    : base;
}