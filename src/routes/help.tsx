import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useState } from "react";
import { ChevronDown, Send, WifiOff, ShieldCheck, Users, Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/help")({ component: Help });

const faqs = [
  { Icon: Send, q: "How do I send money?", a: "Tekan butang 'Send' di laman utama, pilih penerima from senarai atau cari nombor telefon, masukkan jumlah, dan sahkan dengan PIN anda." },
  { Icon: WifiOff, q: "What happens if there's no internet?", a: "Don't worry! Your transaction is saved safely on your phone. When you're back online, it will be sent automatically." },
  { Icon: ShieldCheck, q: "Adakah transactions saya selamat?", a: "Ya. Setiap transactions dilindungi PIN 4 angka peribadi anda. Jangan kongsi PIN dengan sesiapa, termasuk ejen." },
  { Icon: Users, q: "Where can I find a local agent?", a: "Go to the 'Agents' tab to see a list of official KampungPay agents near your village." },
];

function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Shell title="Help & Support" back="/profile">
      <div className="rounded-3xl p-5 bg-primary-soft">
        <p className="font-bold text-lg">Hi! Can we help?</p>
        <p className="text-sm text-foreground/80 mt-1">Find answers below, or contact us directly.</p>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <a href="tel:+601800888888" className="flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold"><Phone className="h-4 w-4"/> Call</a>
          <a href="https://wa.me/60111234567" className="flex items-center justify-center gap-2 h-11 rounded-xl bg-card text-foreground text-sm font-bold border border-border"><MessageCircle className="h-4 w-4"/> WhatsApp</a>
        </div>
      </div>

      <h3 className="mt-6 mb-2 text-xs font-bold uppercase text-muted-foreground tracking-wider">Frequently Asked Questions</h3>
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

      <Link to="/agent" className="mt-6 block w-full h-14 leading-[3.5rem] text-center rounded-2xl bg-primary text-primary-foreground font-bold">Find a Local Agent</Link>
    </Shell>
  );
}
