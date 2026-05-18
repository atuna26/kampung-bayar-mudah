import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { Users, MapPin, Phone, Landmark, BadgeCheck } from "lucide-react";
import { useT } from "@/lib/kp/i18n";

export const Route = createFileRoute("/cashin")({ component: CashIn });

function CashIn() {
  const t = useT();
  return (
    <Shell title={t("Top Up")} back="/home">
      <div className="rounded-3xl bg-primary-soft p-5">
        <Users className="h-8 w-8 text-primary"/>
        <p className="mt-3 font-bold">Top up via your local agent</p>
        <p className="text-sm text-foreground/80 mt-1">Bring cash to a nearby agent. They will add it to your wallet straight away — {t("No hidden charges").toLowerCase()}.</p>
      </div>
      <div className="mt-3 rounded-2xl bg-card border border-border p-3 text-xs space-y-1.5">
        <p className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-primary"/>{t("Compatible with DuitNow QR")}</p>
        <p className="flex items-center gap-2"><Landmark className="h-3.5 w-3.5 text-primary"/>{t("Supports Malaysian bank transfers")}</p>
      </div>
      <div className="mt-4 rounded-2xl bg-card border border-border p-4">
        <div className="flex items-start gap-3">
          <span className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">R</span>
          <div className="flex-1">
            <div className="flex items-center gap-2"><p className="font-bold">Mr. Ramli</p><span className="text-[10px] font-bold text-success bg-success/15 px-1.5 py-0.5 rounded">NEAR</span></div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3"/>Ramli's Mini Market · 0.4 km</p>
          </div>
        </div>
        <a href="tel:+60134445566" className="mt-3 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold"><Phone className="h-4 w-4"/> Call Agents</a>
      </div>
      <Link to="/agent" className="mt-4 block w-full h-12 leading-[3rem] text-center rounded-2xl bg-secondary text-secondary-foreground font-semibold">View all agents</Link>
    </Shell>
  );
}
