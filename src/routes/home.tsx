import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { Send, QrCode, Download, Users, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Store, Banknote } from "lucide-react";
import { useState } from "react";
import { useStore, fmtRM, fmtTime } from "@/lib/kp/store";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const balance = useStore(s => s.balance);
  const txs = useStore(s => s.txs.slice(0, 4));
  const user = useStore(s => s.user);
  const [hide, setHide] = useState(false);

  return (
    <Shell>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">Selamat datang,</p>
          <p className="text-lg font-bold truncate">{user.name}</p>
        </div>

        <div className="rounded-3xl p-5 text-primary-foreground shadow-lg" style={{ background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.12 145))" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider opacity-90">Baki Dompet</span>
            <button onClick={()=>setHide(!hide)} aria-label="Sorok baki" className="opacity-90">{hide ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
          </div>
          <p className="text-4xl font-extrabold mt-2 tracking-tight">{hide ? "RM •••••" : fmtRM(balance)}</p>
          <p className="text-xs opacity-90 mt-1">No. dompet: 0134567890</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link to="/cashin" className="flex items-center justify-center gap-1.5 h-10 rounded-full bg-white/20 text-sm font-semibold backdrop-blur"><Banknote className="h-4 w-4"/> Tambah Nilai</Link>
            <Link to="/transactions" className="flex items-center justify-center gap-1.5 h-10 rounded-full bg-white/20 text-sm font-semibold backdrop-blur">Sejarah</Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Quick to="/send" icon={Send} label="Hantar" />
          <Quick to="/qr" icon={QrCode} label="Imbas QR" />
          <Quick to="/receive" icon={Download} label="Terima" />
          <Quick to="/agent" icon={Users} label="Ejen" />
        </div>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold">Transaksi Terkini</h2>
            <Link to="/transactions" className="text-sm font-semibold text-primary">Lihat semua</Link>
          </div>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
            {txs.map(t => <TxRow key={t.id} t={t} />)}
            {txs.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">Tiada transaksi lagi</p>}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Quick({ to, icon: Icon, label }: any) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card border border-border active:bg-muted">
      <span className="h-11 w-11 rounded-2xl bg-primary-soft flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </span>
      <span className="text-xs font-semibold">{label}</span>
    </Link>
  );
}

export function TxRow({ t }: { t: any }) {
  const cfg = {
    sent: { Icon: ArrowUpRight, color: "text-destructive", sign: "-" },
    received: { Icon: ArrowDownLeft, color: "text-success", sign: "+" },
    merchant: { Icon: Store, color: "text-destructive", sign: "-" },
    cashin: { Icon: Banknote, color: "text-success", sign: "+" },
    cashout: { Icon: Banknote, color: "text-destructive", sign: "-" },
  } as const;
  const c = cfg[t.type as keyof typeof cfg];
  const statusBadge = t.status !== "completed" ? (
    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
      t.status === "pending" ? "bg-warning/30 text-warning-foreground" :
      t.status === "syncing" ? "bg-primary-soft text-primary" :
      "bg-destructive/15 text-destructive"
    }`}>{t.status === "pending" ? "Menunggu" : t.status === "syncing" ? "Menyegerak" : "Gagal"}</span>
  ) : null;
  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"><c.Icon className={`h-5 w-5 ${c.color}`} /></span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{t.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">{fmtTime(t.ts)} {statusBadge}</p>
      </div>
      <p className={`font-bold text-sm ${c.color}`}>{c.sign}{fmtRM(t.amount)}</p>
    </div>
  );
}
