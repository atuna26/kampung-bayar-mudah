import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useState } from "react";
import { Search, ChevronRight, ShieldCheck, WifiOff, CheckCircle2, Loader2, Landmark } from "lucide-react";
import { useStore, store, fmtRM } from "@/lib/kp/store";
import { OFFLINE_TX_LIMIT, OFFLINE_TX_EXPIRY_HOURS, TIER_LIMITS } from "@/lib/kp/store";
import { useT } from "@/lib/kp/i18n";
import { SpeakButton } from "@/components/kp/SpeakButton";

export const Route = createFileRoute("/send")({ component: Send });

const contacts = [
  { name: "Aunty Siti", phone: "+60 12-333 4444", initial: "S" },
  { name: "Brother Hafiz", phone: "+60 13-555 6666", initial: "H" },
  { name: "Uncle Ahmad", phone: "+60 19-777 8888", initial: "A" },
  { name: "Sister Norah", phone: "+60 11-222 1234", initial: "N" },
  { name: "Brother Razak", phone: "+60 17-888 9999", initial: "R" },
];

function Send() {
  const nav = useNavigate();
  const conn = useStore(s => s.connectivity);
  const tier = useStore(s => s.tier);
  const t = useT();
  const [step, setStep] = useState<0|1|2|3>(0);
  const [recipient, setRecipient] = useState<typeof contacts[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const fee = 0;
  const amt = Number(amount) || 0;
  const tierLimit = TIER_LIMITS[tier].perTx;
  const overTierLimit = amt > tierLimit;
  const overOfflineLimit = conn === "offline" && amt > OFFLINE_TX_LIMIT;
  const blocked = overTierLimit || overOfflineLimit;

  const finish = () => {
    setStep(3);
    if (conn === "offline") {
      store.addTx({ type: "sent", name: recipient!.name, amount: Number(amount), note, status: "pending" });
      store.notify({ title: "Transaction saved", body: `RM${amount} to ${recipient!.name} will be sent when you're back online.`, kind: "warn" });
    } else {
      store.addTx({ type: "sent", name: recipient!.name, amount: Number(amount), note, status: "completed" });
      store.notify({ title: "Payment successful", body: `You sent RM${amount} to ${recipient!.name}.`, kind: "success" });
    }
  };

  return (
    <Shell title={step===3 ? t("Done") : t("Send Money")} back={step===0 ? "/home" : undefined} hideNav={step===3}>
      {step===0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 h-12 px-4 rounded-2xl bg-card border border-border">
            <Search className="h-5 w-5 text-muted-foreground"/>
            <input placeholder={t("Search name or phone number")} className="flex-1 bg-transparent outline-none text-base"/>
          </div>
          <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{t("Recent Recipients")}</p>
          <ul className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
            {contacts.map(c => (
              <li key={c.phone}>
                <button onClick={()=>{setRecipient(c); setStep(1);}} className="w-full flex items-center gap-3 p-3.5 active:bg-muted">
                  <span className="h-11 w-11 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center">{c.initial}</span>
                  <span className="flex-1 text-left">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-2"><Landmark className="h-3.5 w-3.5 text-primary"/>{t("Supports Malaysian bank transfers")} · {t("Compatible with DuitNow QR")}</p>
        </div>
      )}

      {step===1 && recipient && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary-soft">
            <span className="h-11 w-11 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">{recipient.initial}</span>
            <div><p className="font-bold text-sm">{recipient.name}</p><p className="text-xs text-foreground/70">{recipient.phone}</p></div>
          </div>
          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">{t("Amount")}</p>
              <SpeakButton text="Enter amount" msText="Masukkan jumlah" label={t("Listen")} />
            </div>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-3xl font-bold text-muted-foreground">RM</span>
              <span className="text-6xl font-extrabold">{amount || "0"}</span>
            </div>
          <p className="text-xs text-muted-foreground mt-2">Fee: {fmtRM(fee)} · {t("No hidden charges")}</p>
          {overTierLimit && (
            <p className="text-xs text-destructive mt-1 font-semibold">Over your {TIER_LIMITS[tier].label} limit of {fmtRM(tierLimit)}. Verify with MyKad to raise it.</p>
          )}
          {overOfflineLimit && !overTierLimit && (
            <p className="text-xs text-warning-foreground mt-1 font-semibold">Offline limit is {fmtRM(OFFLINE_TX_LIMIT)} per transaction.</p>
          )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k=>(
              <button key={k} onClick={()=>{
                if(k==="⌫") setAmount(amount.slice(0,-1));
                else if(k==="." && amount.includes(".")) return;
                else if(amount.length<7) setAmount(amount + k);
              }} className="h-14 rounded-2xl text-xl font-bold bg-card shadow-sm active:bg-muted">{k}</button>
            ))}
          </div>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder={t("Message (optional)")} className="w-full h-12 px-4 rounded-2xl bg-card border border-border outline-none text-sm focus:border-primary"/>
          <button disabled={!amt || blocked} onClick={()=>setStep(2)} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold disabled:opacity-50">{t("Next")}</button>
        </div>
      )}

      {step===2 && recipient && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-card border border-border p-5 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">You're sending</p>
              <p className="text-4xl font-extrabold text-primary mt-1">{fmtRM(Number(amount))}</p>
            </div>
            <div className="border-t border-border pt-4 space-y-2.5 text-sm">
              <Row k="To" v={recipient.name}/>
              <Row k="Phone Number" v={recipient.phone}/>
              <Row k="Fee" v="Free"/>
              {note && <Row k="Message" v={note}/>}
              <Row k="Total to Pay" v={fmtRM(Number(amount))} bold/>
            </div>
          </div>
          {conn === "offline" && (
            <div className="rounded-2xl bg-warning/15 p-4 flex gap-3">
              <WifiOff className="h-5 w-5 text-warning-foreground shrink-0 mt-0.5"/>
              <div>
                <p className="font-bold text-sm">No internet connection</p>
                <p className="text-xs text-foreground/80 mt-0.5">Saved safely and sent automatically when you reconnect. Pending transactions expire after {OFFLINE_TX_EXPIRY_HOURS} hours if not synced.</p>
              </div>
            </div>
          )}
          <div className="rounded-2xl bg-primary-soft p-4 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5"/>
            <p className="text-sm text-foreground flex-1">{t("Protected payment")} · {t("No hidden charges")} · {t("Compatible with DuitNow QR")}</p>
          </div>
          <button onClick={finish} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">{t("Confirm & Send")}</button>
          <button onClick={()=>setStep(1)} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">{t("Back")}</button>
        </div>
      )}

      {step===3 && recipient && (
        <div className="flex flex-col items-center text-center pt-12 px-2">
          {conn === "offline" ? (
            <>
              <div className="h-24 w-24 rounded-full bg-warning/20 flex items-center justify-center"><Loader2 className="h-12 w-12 text-warning-foreground animate-spin"/></div>
              <h2 className="mt-6 text-2xl font-extrabold">{t("Saved safely")}</h2>
              <p className="mt-2 text-muted-foreground">No connection available. Your transaction will be sent automatically when you're back online.</p>
              <SpeakButton className="mt-3" text="Transaction queued safely. It will be sent when you are back online." msText="Transaksi disimpan dengan selamat. Akan dihantar bila dalam talian." label={t("Listen")} />
            </>
          ) : (
            <>
              <div className="h-24 w-24 rounded-full bg-success/20 flex items-center justify-center"><CheckCircle2 className="h-14 w-14 text-success"/></div>
              <h2 className="mt-6 text-2xl font-extrabold">{t("Payment Successful")}</h2>
              <p className="mt-2 text-muted-foreground">You sent</p>
              <SpeakButton className="mt-3" text="Payment successful." msText="Pembayaran berjaya." label={t("Listen")} />
            </>
          )}
          <p className="text-4xl font-extrabold text-primary mt-3">{fmtRM(Number(amount))}</p>
          <p className="text-sm text-muted-foreground">to {recipient.name}</p>
          <div className="mt-8 w-full space-y-3">
            <button onClick={()=>nav({to:"/home"})} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">{t("Done")}</button>
            <button onClick={()=>nav({to:"/transactions"})} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">{t("View history")}</button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className={bold ? "font-extrabold text-foreground" : "font-semibold text-foreground"}>{v}</span>
    </div>
  );
}
