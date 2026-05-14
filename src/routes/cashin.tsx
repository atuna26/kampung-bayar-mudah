import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { Users, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/cashin")({ component: CashIn });

function CashIn() {
  return (
    <Shell title="Tambah Nilai" back="/home">
      <div className="rounded-3xl bg-primary-soft p-5">
        <Users className="h-8 w-8 text-primary"/>
        <p className="mt-3 font-bold">Tambah nilai melalui ejen tempatan</p>
        <p className="text-sm text-foreground/80 mt-1">Bawa wang tunai kepada ejen berdekatan. Mereka akan masukkan ke dompet anda dengan segera.</p>
      </div>
      <div className="mt-4 rounded-2xl bg-card border border-border p-4">
        <div className="flex items-start gap-3">
          <span className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">R</span>
          <div className="flex-1">
            <div className="flex items-center gap-2"><p className="font-bold">Encik Ramli</p><span className="text-[10px] font-bold text-success bg-success/15 px-1.5 py-0.5 rounded">DEKAT</span></div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3"/>Kedai Runcit Ramli · 0.4 km</p>
          </div>
        </div>
        <a href="tel:+60134445566" className="mt-3 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold"><Phone className="h-4 w-4"/> Hubungi Ejen</a>
      </div>
      <Link to="/agent" className="mt-4 block w-full h-12 leading-[3rem] text-center rounded-2xl bg-secondary text-secondary-foreground font-semibold">Lihat semua ejen</Link>
    </Shell>
  );
}
