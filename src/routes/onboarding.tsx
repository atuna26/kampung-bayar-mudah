import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, WifiOff, ShieldCheck, Users } from "lucide-react";
import logo from "@/assets/kampungpay-logo.png";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const slides = [
  { Icon: Wallet, title: "Hantar wang dengan mudah", body: "Hanya beberapa ketukan untuk hantar wang kepada keluarga & rakan." },
  { Icon: WifiOff, title: "Boleh guna walaupun internet lemah", body: "Transaksi anda disimpan dengan selamat dan dihantar bila ada sambungan." },
  { Icon: ShieldCheck, title: "Selamat & kos rendah", body: "PIN peribadi dan pengesahan penuh untuk setiap transaksi." },
  { Icon: Users, title: "Bantuan ejen tempatan", body: "Ejen kampung sentiasa sedia membantu anda mendaftar dan tambah nilai." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const S = slides[i];
  const last = i === slides.length - 1;
  return (
    <div className="mx-auto max-w-md min-h-dvh flex flex-col bg-background">
      <div className="flex items-center justify-between px-5 py-4">
        <img src={logo} alt="" className="h-9 w-9 rounded-full" />
        <Link to="/login" className="text-sm text-muted-foreground">Langkau</Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="h-40 w-40 rounded-full bg-primary-soft flex items-center justify-center">
          <S.Icon className="h-20 w-20 text-primary" strokeWidth={1.6} />
        </div>
        <h2 className="mt-8 text-2xl font-extrabold text-foreground">{S.title}</h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">{S.body}</p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, idx) => (
          <span key={idx} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-border"}`} />
        ))}
      </div>
      <div className="px-6 pb-8 space-y-3">
        {!last ? (
          <button onClick={() => setI(i + 1)} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">Seterusnya</button>
        ) : (
          <Link to="/register" className="block w-full h-14 leading-[3.5rem] rounded-2xl bg-primary text-primary-foreground text-lg font-bold text-center">Buka Akaun</Link>
        )}
        <Link to="/login" className="block w-full h-12 leading-[3rem] rounded-2xl bg-secondary text-secondary-foreground text-base font-semibold text-center">Saya sudah ada akaun</Link>
      </div>
    </div>
  );
}
