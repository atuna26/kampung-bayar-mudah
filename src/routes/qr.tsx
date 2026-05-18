import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useState } from "react";
import { QrCode, Store, CheckCircle2, ArrowLeftRight, ShieldCheck, WifiOff, Share2, TrendingUp, BadgeCheck } from "lucide-react";
import { store, fmtRM, useStore } from "@/lib/kp/store";
import { useT } from "@/lib/kp/i18n";
import { SpeakButton } from "@/components/kp/SpeakButton";

export const Route = createFileRoute("/qr")({ component: QR });

function QR() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"scan"|"merchant">("scan");
  const [step, setStep] = useState<0|1|2|3>(0);
  const [amount, setAmount] = useState("");
  const t = useT();
  const conn = useStore(s => s.connectivity);
  const merchant = { name: "Mr. Joseph's Mini Market", id: "MRC-23984", location: "Kg. Sandakan, Sabah" };
  const allTxs = useStore(s => s.txs);
  const txs = allTxs.filter(t => t.type==="merchant" || t.type==="received").slice(0,5);
  const today = new Date(); today.setHours(0,0,0,0);
  const todayTxs = allTxs.filter(t => (t.type==="merchant"||t.type==="received") && t.ts >= today.getTime() && t.status==="completed");
  const todayTotal = todayTxs.reduce((s,t)=>s+t.amount,0);

  const pay = () => {
    const isOffline = conn === "offline";
    store.addTx({ type: "merchant", name: merchant.name, amount: Number(amount), status: isOffline ? "pending" : "completed", note: "QR Payment" });
    store.notify({ title: isOffline ? "Payment queued" : "Payment successful", body: `RM${amount} to ${merchant.name}.`, kind: isOffline ? "warn" : "success" });
    setStep(3);
  };

  const shareReceipt = async (tx: { name: string; amount: number }) => {
    const text = `KampungPay receipt — ${tx.name}: ${fmtRM(tx.amount)}`;
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: "KampungPay receipt", text });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert("Receipt copied to clipboard");
      }
    } catch { /* no-op */ }
  };

  return (
    <Shell title={t("QR Payment")}>
      <div className="flex p-1 rounded-2xl bg-muted mb-4">
        <button onClick={()=>{setMode("scan"); setStep(0); setAmount("");}} className={`flex-1 h-10 rounded-xl text-sm font-bold ${mode==="scan"?"bg-card shadow":"text-muted-foreground"}`}>{t("Pay Shop")}</button>
        <button onClick={()=>setMode("merchant")} className={`flex-1 h-10 rounded-xl text-sm font-bold ${mode==="merchant"?"bg-card shadow":"text-muted-foreground"}`}>{t("I'm a Merchant")}</button>
      </div>

      {mode==="scan" && step===0 && (
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl bg-foreground/95 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-6 rounded-2xl border-2 border-primary/70" />
            <div className="absolute left-6 right-6 h-0.5 bg-primary animate-pulse" style={{ top: "50%" }} />
            <div className="text-center text-background/80 px-6 z-10">
              <QrCode className="h-14 w-14 mx-auto mb-2 opacity-60"/>
              <p className="text-sm">Point your camera at the shop's QR code</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <Chip icon={BadgeCheck}>{t("Compatible with DuitNow QR")}</Chip>
            <Chip icon={ShieldCheck}>{t("Protected payment")}</Chip>
            <Chip icon={WifiOff}>{t("Offline-compatible QR")}</Chip>
          </div>
          <button onClick={()=>setStep(1)} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">Demo: Scan Mr. Joseph's Shop QR</button>
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
            <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-1 rounded inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3"/>{t("Verified Merchant")}</span>
          </div>
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">{t("Enter amount")}</p>
              <SpeakButton text="Enter amount" msText="Masukkan jumlah" label={t("Listen")} />
            </div>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-2xl font-bold text-muted-foreground">RM</span>
              <span className="text-5xl font-extrabold">{amount || "0"}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{t("No hidden charges")}</p>
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
          <button disabled={!Number(amount)} onClick={()=>setStep(2)} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold disabled:opacity-50">{t("Confirm Payment")}</button>
        </div>
      )}

      {mode==="scan" && step===2 && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-card border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground">Paying to</p>
            <p className="font-bold text-lg mt-1">{merchant.name}</p>
            <p className="text-4xl font-extrabold text-primary mt-3">{fmtRM(Number(amount))}</p>
            <p className="text-xs text-muted-foreground mt-2">Fee: Free · {t("No hidden charges")}</p>
          </div>
          {conn === "offline" && (
            <div className="rounded-2xl bg-warning/15 p-3 flex gap-2 text-xs">
              <WifiOff className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5"/>
              <span>Offline — payment will be queued and synced automatically when you reconnect.</span>
            </div>
          )}
          <button onClick={pay} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">{t("Confirm with PIN")}</button>
          <button onClick={()=>setStep(1)} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">{t("Back")}</button>
        </div>
      )}

      {mode==="scan" && step===3 && (
        <div className="flex flex-col items-center text-center pt-10">
          <div className={`h-24 w-24 rounded-full flex items-center justify-center ${conn==="offline" ? "bg-warning/20" : "bg-success/20"}`}>
            <CheckCircle2 className={`h-14 w-14 ${conn==="offline" ? "text-warning-foreground" : "text-success"}`}/>
          </div>
          <h2 className="mt-5 text-2xl font-extrabold">{conn==="offline" ? t("Saved safely") : t("Payment Successful")}</h2>
          <SpeakButton className="mt-2" text={conn==="offline" ? "Transaction queued safely." : "Payment successful."} msText={conn==="offline" ? "Transaksi disimpan dengan selamat." : "Pembayaran berjaya."} label={t("Listen")} />
          <p className="text-4xl font-extrabold text-primary mt-3">{fmtRM(Number(amount))}</p>
          <p className="text-sm text-muted-foreground">to {merchant.name}</p>
          <div className="mt-8 w-full space-y-3">
            <button onClick={()=>shareReceipt({ name: merchant.name, amount: Number(amount) })} className="w-full h-12 rounded-2xl bg-card border border-border font-semibold inline-flex items-center justify-center gap-2"><Share2 className="h-4 w-4"/>{t("Share receipt")}</button>
            <button onClick={()=>{setStep(0); setAmount("");}} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">{t("Pay again")}</button>
            <button onClick={()=>nav({to:"/home"})} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">{t("Back to Home")}</button>
          </div>
        </div>
      )}

      {mode==="merchant" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary-soft p-3">
              <p className="text-[10px] uppercase tracking-wider text-foreground/70 font-bold flex items-center gap-1"><TrendingUp className="h-3 w-3"/>{t("Today's earnings")}</p>
              <p className="text-2xl font-extrabold mt-1 text-primary">{fmtRM(todayTotal)}</p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{t("Transactions")}</p>
              <p className="text-2xl font-extrabold mt-1">{todayTxs.length}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-card border border-border p-5 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{t("My QR")}</p>
            <p className="font-bold mt-1">Mr. Joseph's Mini Market</p>
            <p className="text-[10px] text-success font-bold inline-flex items-center gap-1 mt-1"><BadgeCheck className="h-3 w-3"/>{t("Verified Merchant")} · {t("Compatible with DuitNow QR")}</p>
            <div className="mx-auto mt-4 h-52 w-52 rounded-2xl bg-foreground p-3">
              <div className="w-full h-full bg-background rounded-lg grid grid-cols-12 grid-rows-12 gap-px p-2">
                {Array.from({length:144}).map((_,i)=>(
                  <span key={i} className={`${(i*7+3)%5<2?"bg-foreground":"bg-transparent"} rounded-sm`}/>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Show this QR to the customer to receive payments</p>
            <SpeakButton className="mt-2" text="Show this QR to receive payment." msText="Tunjukkan QR ini untuk menerima bayaran." label={t("Listen")} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2"><ArrowLeftRight className="h-4 w-4 text-primary"/><h3 className="font-bold text-sm">Recent Receipts</h3></div>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
              {txs.map(t => (
                <div key={t.id} className="p-3.5 flex items-center justify-between gap-2">
                  <div className="min-w-0"><p className="font-semibold text-sm truncate">{t.name}</p><p className="text-xs text-muted-foreground">QR Payment</p></div>
                  <p className="font-bold text-success">+{fmtRM(t.amount)}</p>
                  <button onClick={()=>shareReceipt({ name: t.name, amount: t.amount })} aria-label="Share receipt" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0"><Share2 className="h-4 w-4 text-muted-foreground"/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Chip({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary-soft text-primary">
      <Icon className="h-3 w-3"/>{children}
    </span>
  );
}
