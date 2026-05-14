import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useState } from "react";
import { ChevronDown, Send, WifiOff, ShieldCheck, Users, Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/help")({ component: Help });

const faqs = [
  { Icon: Send, q: "Bagaimana cara hantar wang?", a: "Tekan butang 'Hantar' di laman utama, pilih penerima daripada senarai atau cari nombor telefon, masukkan jumlah, dan sahkan dengan PIN anda." },
  { Icon: WifiOff, q: "Apa berlaku jika tiada internet?", a: "Jangan risau! Transaksi anda akan disimpan dengan selamat dalam telefon. Bila sambungan kembali, ia akan dihantar secara automatik." },
  { Icon: ShieldCheck, q: "Adakah transaksi saya selamat?", a: "Ya. Setiap transaksi dilindungi PIN 4 angka peribadi anda. Jangan kongsi PIN dengan sesiapa, termasuk ejen." },
  { Icon: Users, q: "Di mana saya boleh jumpa ejen tempatan?", a: "Pergi ke tab 'Ejen' untuk melihat senarai ejen rasmi KampungPay berhampiran kampung anda." },
];

function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Shell title="Bantuan & Sokongan" back="/profile">
      <div className="rounded-3xl p-5 bg-primary-soft">
        <p className="font-bold text-lg">Hai! Boleh kami bantu?</p>
        <p className="text-sm text-foreground/80 mt-1">Cari jawapan di bawah, atau hubungi kami terus.</p>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <a href="tel:+601800888888" className="flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold"><Phone className="h-4 w-4"/> Telefon</a>
          <a href="https://wa.me/60111234567" className="flex items-center justify-center gap-2 h-11 rounded-xl bg-card text-foreground text-sm font-bold border border-border"><MessageCircle className="h-4 w-4"/> WhatsApp</a>
        </div>
      </div>

      <h3 className="mt-6 mb-2 text-xs font-bold uppercase text-muted-foreground tracking-wider">Soalan Lazim</h3>
      <ul className="space-y-2">
        {faqs.map((f, i) => (
          <li key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
            <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center gap-3 p-4 text-left">
              <span className="h-10 w-10 rounded-2xl bg-primary-soft flex items-center justify-center shrink-0"><f.Icon className="h-5 w-5 text-primary"/></span>
              <span className="flex-1 font-semibold text-sm">{f.q}</span>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open===i?"rotate-180":""}`}/>
            </button>
            {open===i && <div className="px-4 pb-4 pl-[4.25rem] text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
          </li>
        ))}
      </ul>

      <Link to="/agent" className="mt-6 block w-full h-14 leading-[3.5rem] text-center rounded-2xl bg-primary text-primary-foreground font-bold">Cari Ejen Tempatan</Link>
    </Shell>
  );
}
