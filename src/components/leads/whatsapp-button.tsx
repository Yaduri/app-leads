import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppButton({
  phone,
  message,
  label,
}: {
  phone: string | null;
  message: string | null;
  label?: string;
}) {
  const url = buildWhatsAppUrl(phone ?? "", message);

  if (!url) {
    return (
      <Button
        variant="ghost"
        size={label ? "default" : "icon"}
        disabled
        title="Sem número válido de WhatsApp"
        aria-label="Sem número de WhatsApp"
        className={label ? "text-muted-foreground" : undefined}
      >
        <MessageCircle className="size-4" />
        {label ? <span className="ml-2">{label}</span> : null}
      </Button>
    );
  }

  return (
    <Button
      render={
        <a href={url} target="_blank" rel="noopener noreferrer" />
      }
      size={label ? "default" : "icon"}
      className="bg-green-600 text-white hover:bg-green-700"
      title="Abrir conversa no WhatsApp"
    >
      <MessageCircle className="size-4" />
      {label ? <span className="ml-2">{label}</span> : null}
    </Button>
  );
}