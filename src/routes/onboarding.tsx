import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, WifiOff, ShieldCheck, Users, Landmark, Smartphone, BadgeCheck } from "lucide-react";
import logo from "@/assets/kampungpay-logo.png";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const slides = [
  { Icon: Wallet, title: "Send money easily", body: "Just a few taps to send money to family & friends." },
  { Icon: WifiOff, title: "Works even with weak internet", body: "Your transactions are saved safely and sent when you're back online." },
  { Icon: ShieldCheck, title: "Safe & low cost", body: "Private PIN and full confirmation for every transaction." },
  { Icon: Users, title: "Local agent support", body: "Village agents are always ready to help you register and top up." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const S = slides[i];
  const last = i === slides.length - 1;
  return (
    <div className="mx-auto max-w-md min-h-dvh flex flex-col bg-background">
      <div className="flex items-center justify-between px-5 py-4">
        <img src={logo} alt="" className="h-9 w-9 rounded-full" />
        <Link to="/login" className="text-sm text-muted-foreground">Skip</Link>
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
      <div className="px-6 mb-3 flex flex-wrap gap-1.5 justify-center">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary-soft text-primary"><BadgeCheck className="h-3 w-3"/>Compatible with DuitNow QR</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary-soft text-primary"><Landmark className="h-3 w-3"/>Malaysian bank transfers</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary-soft text-primary"><Smartphone className="h-3 w-3"/>Apple / Google Wallet</span>
      </div>
      <div className="px-6 pb-8 space-y-3">
        {!last ? (
          <button onClick={() => setI(i + 1)} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">Next</button>
        ) : (
          <Link to="/register" className="block w-full h-14 leading-[3.5rem] rounded-2xl bg-primary text-primary-foreground text-lg font-bold text-center">Create Account</Link>
        )}
        <Link to="/login" className="block w-full h-12 leading-[3rem] rounded-2xl bg-secondary text-secondary-foreground text-base font-semibold text-center">I already have an account</Link>
      </div>
    </div>
  );
}
