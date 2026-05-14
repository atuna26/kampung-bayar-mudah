import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useState } from "react";
import { QrCode, Store, CheckCircle2, ArrowLeftRight } from "lucide-react";
import { store, fmtRM, useStore } from "@/lib/kp/store";

export const Route = createFileRoute("/qr")({ component: QR });

function QR() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"scan"|"merchant">("scan");
  const [step, setStep] = useState<0|1|2|3>(0);
  const [amount, setAmount] = useState("");
  const merchant = { name: "Kedai Runcit Pak Joseph", id: "MRC-23984", location: "Kg. Sandakan, Sabah" };
  const txs = useStore(s => s.txs.filter(t => t.type==="merchant" || t.type==="received").slice(0,5));

  const pay = () => {
    store.addTx({ type: "merchant", name: merchant.name, amount: Number(amount), status: "completed", note: "Pembayaran QR" });
    store.notify({ title: "Pembayaran berjaya", body: `RM${amount} kepada ${merchant.name}.`, kind: "success" });
    setStep(3);
  };

  return (
    <Shell title="QR Pembayaran">
      <div className="flex p-1 rounded-2xl bg-muted mb-4">
        <button onClick={()=>{setMode("scan"); setStep(0); setAmount("");}} className={`flex-1 h-10 rounded-xl text-sm font-bold ${mode==="scan"?"bg-card shadow":"text-muted-foreground"}`}>Bayar Kedai</button>
        <button onClick={()=>setMode("merchant")} className={`flex-1 h-10 rounded-xl text-sm font-bold ${mode==="merchant"?"bg-card shadow":"text-muted-foreground"}`}>Saya Peniaga</button>
      </div>

      {mode==="scan" && step===0 && (
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl bg-foreground/95 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-6 rounded-2xl border-2 border-primary/70" />
            <div className="absolute left-6 right-6 h-0.5 bg-primary animate-pulse" style={{ top: "50%" }} />
            <div className="text-center text-background/80 px-6 z-10">
              <QrCode className="h-14 w-14 mx-auto mb-2 opacity-60"/>
              <p className="text-sm">Halakan kamera ke kod QR kedai</p>
            </div>
          </div>
          <button onClick={()=>setStep(1)} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">Demo: Imbas QR Kedai Pak Joseph</button>
        </div>
      )}

      {mode==="scan" && step===1 && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center"><Store className="h-6 w-6 text-primary"/></span>
            <div className="flex-1 min-w-0">
              <p className="font-bold">{merchant.name}</p>
              <p className="text-xs text-muted-foreground">{merchant.location} · {merchant.id}</p>
            </div>
            <span className="text-xs font-bold text-success bg-success/15 px-2 py-1 rounded">Disahkan</span>
          </div>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Masukkan jumlah</p>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-2xl font-bold text-muted-foreground">RM</span>
              <span className="text-5xl font-extrabold">{amount || "0"}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k=>(
              <button key={k} onClick={()=>{
                if(k==="⌫") setAmount(amount.slice(0,-1));
                else if(k==="." && amount.includes(".")) return;
                else if(amount.length<7) setAmount(amount+k);
              }} className="h-14 rounded-2xl text-xl font-bold bg-card shadow-sm active:bg-muted">{k}</button>
            ))}
          </div>
          <button disabled={!Number(amount)} onClick={()=>setStep(2)} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold disabled:opacity-50">Sahkan Bayaran</button>
        </div>
      )}

      {mode==="scan" && step===2 && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-card border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground">Bayar kepada</p>
            <p className="font-bold text-lg mt-1">{merchant.name}</p>
            <p className="text-4xl font-extrabold text-primary mt-3">{fmtRM(Number(amount))}</p>
            <p className="text-xs text-muted-foreground mt-2">Yuran: Percuma</p>
          </div>
          <button onClick={pay} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">Sahkan dengan PIN</button>
          <button onClick={()=>setStep(1)} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">Kembali</button>
        </div>
      )}

      {mode==="scan" && step===3 && (
        <div className="flex flex-col items-center text-center pt-10">
          <div className="h-24 w-24 rounded-full bg-success/20 flex items-center justify-center"><CheckCircle2 className="h-14 w-14 text-success"/></div>
          <h2 className="mt-5 text-2xl font-extrabold">Pembayaran Berjaya</h2>
          <p className="text-4xl font-extrabold text-primary mt-3">{fmtRM(Number(amount))}</p>
          <p className="text-sm text-muted-foreground">kepada {merchant.name}</p>
          <div className="mt-8 w-full space-y-3">
            <button onClick={()=>{setStep(0); setAmount("");}} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">Bayar lagi</button>
            <button onClick={()=>nav({to:"/home"})} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">Kembali ke Utama</button>
          </div>
        </div>
      )}

      {mode==="merchant" && (
        <div className="space-y-5">
          <div className="rounded-3xl bg-card border border-border p-5 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">QR Saya</p>
            <p className="font-bold mt-1">Kedai Runcit Pak Joseph</p>
            <div className="mx-auto mt-4 h-52 w-52 rounded-2xl bg-foreground p-3">
              <div className="w-full h-full bg-background rounded-lg grid grid-cols-12 grid-rows-12 gap-px p-2">
                {Array.from({length:144}).map((_,i)=>(
                  <span key={i} className={`${(i*7+3)%5<2?"bg-foreground":"bg-transparent"} rounded-sm`}/>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Tunjukkan QR ini kepada pelanggan untuk menerima bayaran</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2"><ArrowLeftRight className="h-4 w-4 text-primary"/><h3 className="font-bold text-sm">Penerimaan Terkini</h3></div>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
              {txs.map(t => (
                <div key={t.id} className="p-3.5 flex items-center justify-between">
                  <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-muted-foreground">Pembayaran QR</p></div>
                  <p className="font-bold text-success">+{fmtRM(t.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
