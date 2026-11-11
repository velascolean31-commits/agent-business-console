"use client";

import { useState } from "react";

// Petición de cita que llega al negocio por WhatsApp. No se guarda ningún dato en nuestro servidor:
// se abre WhatsApp con el mensaje ya escrito y lo envía el propio cliente.
export function BookingForm({ waNumber, businessName, cta }: { waNumber: string; businessName: string; cta: string }) {
  const [name, setName] = useState("");
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");

  const text = [
    `Hola, soy ${name.trim()}.`,
    `Escribo desde la web de ${businessName} para ${cta.toLowerCase()}.`,
    when.trim() ? `Día y hora que prefiero: ${when.trim()}.` : "",
    note.trim(),
  ]
    .filter(Boolean)
    .join(" ");
  const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  const ready = name.trim().length >= 2;

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) window.open(href, "_blank", "noopener");
      }}
    >
      <input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} />
      <input placeholder="Día y hora que prefieres" value={when} onChange={(e) => setWhen(e.target.value)} maxLength={80} />
      <textarea placeholder="Mensaje (opcional)" rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={400} />
      <button className="btn">{cta} por WhatsApp</button>
      <p className="legal">Se abrirá WhatsApp con el mensaje escrito para que lo envíes a {businessName}.</p>
    </form>
  );
}
