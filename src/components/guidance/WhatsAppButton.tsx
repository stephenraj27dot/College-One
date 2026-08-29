"use client";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  collegeName?: string;
  courseName?: string;
  className?: string;
  variant?: "primary" | "whatsapp" | "outline";
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function WhatsAppButton({
  collegeName,
  courseName,
  className,
  variant = "whatsapp",
  size = "md",
  label = "WhatsApp Admission Desk",
}: WhatsAppButtonProps) {
  let message = siteConfig.whatsappDefaultMessage;
  if (collegeName && courseName) {
    message = `Hi College Guide Team, I am interested in ${courseName} at ${collegeName}. Please share admission guidance, cutoff details, and fee structure.`;
  } else if (collegeName) {
    message = `Hi College Guide Team, I need admission guidance and cutoff details for ${collegeName}.`;
  }

  const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block">
      <Button variant={variant} size={size} className={className}>
        <MessageCircle className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </Button>
    </a>
  );
}
