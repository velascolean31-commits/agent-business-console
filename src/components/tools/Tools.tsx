"use client";

import { useState } from "react";

const num = (v: string) => {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};
const eur = (n: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="result">
      <span>{label}</span> <b>{value}</b>
    </p>
  );
}

export function VatCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("21");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const a = num(amount);
  const r = Number(rate) / 100;
  const ok = amount !== "" && !Number.isNaN(a) && a >= 0;
  const base = mode === "add" ? a : a / (1 + r);
  const total = mode === "add" ? a * (1 + r) : a;

  return (
    <div className="form">
      <select value={mode} onChange={(e) => setMode(e.target.value as "add" | "remove")} aria-label="Tipo de cálculo">
        <option value="add">Tengo el precio sin IVA</option>
        <option value="remove">Tengo el precio con IVA</option>
      </select>
      <input inputMode="decimal" placeholder="Importe en euros" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select value={rate} onChange={(e) => setRate(e.target.value)} aria-label="Tipo de IVA">
        <option value="21">21 % (general)</option>
        <option value="10">10 % (reducido)</option>
        <option value="4">4 % (superreducido)</option>
      </select>
      {ok ? (
        <div className="out" aria-live="polite">
          <Row label="Base (sin IVA)" value={eur(base)} />
          <Row label={`IVA (${rate} %)`} value={eur(total - base)} />
          <Row label="Total (con IVA)" value={eur(total)} />
        </div>
      ) : (
        <p className="legal">Escribe un importe para ver el resultado.</p>
      )}
    </div>
  );
}

export function MarginCalculator() {
  const [cost, setCost] = useState("");
  const [margin, setMargin] = useState("30");
  const c = num(cost);
  const m = num(margin) / 100;
  const ok = cost !== "" && !Number.isNaN(c) && c >= 0 && !Number.isNaN(m) && m >= 0 && m < 1;
  const price = c / (1 - m);

  return (
    <div className="form">
      <input inputMode="decimal" placeholder="Coste en euros (sin IVA)" value={cost} onChange={(e) => setCost(e.target.value)} />
      <input inputMode="decimal" placeholder="Margen deseado sobre el precio (%)" value={margin} onChange={(e) => setMargin(e.target.value)} />
      {ok ? (
        <div className="out" aria-live="polite">
          <Row label="Precio de venta (sin IVA)" value={eur(price)} />
          <Row label="Beneficio por venta" value={eur(price - c)} />
          <Row label="Recargo sobre el coste" value={c > 0 ? `${(((price - c) / c) * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %` : "—"} />
        </div>
      ) : (
        <p className="legal">Escribe el coste y un margen entre 0 y 99 %.</p>
      )}
    </div>
  );
}

export function WhatsAppLink() {
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  let digits = phone.replace(/\D/g, "").replace(/^00/, "");
  if (digits.length === 9) digits = `34${digits}`;
  const ok = digits.length >= 10 && digits.length <= 15;
  const link = ok ? `https://wa.me/${digits}${text.trim() ? `?text=${encodeURIComponent(text.trim())}` : ""}` : "";

  return (
    <div className="form">
      <input inputMode="tel" placeholder="Teléfono (ej. 612 345 678)" value={phone} onChange={(e) => { setPhone(e.target.value); setCopied(false); }} />
      <textarea rows={3} placeholder="Mensaje que aparecerá escrito (opcional)" value={text} onChange={(e) => { setText(e.target.value); setCopied(false); }} />
      {ok ? (
        <div className="out" aria-live="polite">
          <p className="result"><span>Tu enlace</span></p>
          <p className="link">{link}</p>
          <button
            type="button"
            className="btn"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(link);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "Copiado" : "Copiar enlace"}
          </button>
        </div>
      ) : (
        <p className="legal">Escribe un teléfono. Si tiene 9 cifras se añade el prefijo de España (34).</p>
      )}
    </div>
  );
}
