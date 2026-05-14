import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useEffect, useState } from "react";
import { Sparkles, HeartHandshake, ShieldCheck, WifiOff, Wifi, CheckCircle2, Loader2, HelpCircle, ArrowLeft, ArrowRight, User } from "lucide-react";
import { useStore, store, fmtRM } from "@/lib/kp/store";

export const Route = createFileRoute("/guided")({ component: Guided });

type Step = "intro" | "recipient" | "amount" | "confirm" | "offline" | "success";

const contacts = [
  { name: "Aunty Siti", relation: "Sister", initial: "S", color: "bg-primary-soft text-primary" },
  { name: "Uncle Ahmad", relation: "Father", initial: "A", color: "bg-accent/40 text-accent-foreground" },
  { name: "Brother Hafiz", relation: "Son", initial: "H", color: "bg-success/20 text-success" },
  { name: "Sister Norah", relation: "Daughter", initial: "N", color: "bg-warning/30 text-warning-foreground" },
];

const STEP_INDEX: Record<Step, number> = { intro: 0, recipient: 1, amount: 2, confirm: 3, offline: 4, success: 5 };

function Progress({ step }: { step: Step }) {
  const idx = STEP_INDEX[step];
  const total = 5;
  return (
    <div className="flex items-center gap-1.5 mb-4" aria-label={`Step ${idx} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-2 flex-1 rounded-full ${i < idx ? "bg-primary" : "bg-muted"}`} />
      ))}
    </div>
  );
}

function HelpButton() {
  return (
    <Link to="/agent" className="w-full mt-4 flex items-center justify-center gap-2 h-14 rounded-2xl bg-accent/30 text-accent-foreground text-lg font-bold border-2 border-accent">
      <HelpCircle className="h-6 w-6" />
      Need Help From Local Agent?
    </Link>
  );
}

function Guided() {
  const nav = useNavigate();
  const balance = useStore(s => s.balance);
  const [step, setStep] = useState<Step>("intro");
  const [recipient, setRecipient] = useState<typeof contacts[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const fee = 0;

  // Auto-reconnect simulation: when on offline screen, after 4s reconnect & sync.
  useEffect(() => {
    if (step !== "offline") return;
    const t = setTimeout(() => {
      store.setConnectivity("online");
      store.syncPending();
      store.notify({ title: "Payment completed", body: `RM${amount} sent to ${recipient?.name}.`, kind: "success" });
      setStep("success");
    }, 4200);
    return () => clearTimeout(t);
  }, [step, amount, recipient]);

  const startGuided = () => setStep("recipient");

  const submit = () => {
    // Force weak/offline simulation for the demo
    store.setConnectivity("offline");
    const tx = store.addTx({ type: "sent", name: recipient!.name, amount: Number(amount), status: "pending" });
    setPendingId(tx.id);
    store.notify({ title: "Connection is weak", body: "Your payment is safely stored and will complete automatically.", kind: "warn" });
    setStep("offline");
  };

  return (
    <Shell title="Guided Mode" back={step === "intro" ? "/home" : undefined} hideNav>
      {step !== "intro" && step !== "success" && <Progress step={step} />}

      {step === "intro" && (
        <div className="space-y-6 pt-2">
          <div className="rounded-3xl p-6 text-center" style={{ background: "linear-gradient(135deg, var(--primary-soft), var(--accent))" }}>
            <div className="h-20 w-20 mx-auto rounded-full bg-white flex items-center justify-center shadow">
              <HeartHandshake className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold">Guided Mode</h2>
            <p className="mt-2 text-base text-foreground/80">Big buttons. Simple steps. We will help you send money safely.</p>
          </div>

          <ul className="space-y-3">
            {[
              { icon: Sparkles, t: "Larger buttons & text" },
              { icon: ShieldCheck, t: "Safe even if internet is weak" },
              { icon: HelpCircle, t: "Help from a local agent anytime" },
            ].map(({ icon: Ic, t }) => (
              <li key={t} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
                <span className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center"><Ic className="h-6 w-6 text-primary" /></span>
                <span className="text-lg font-semibold">{t}</span>
              </li>
            ))}
          </ul>

          <button onClick={startGuided} className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-extrabold shadow-lg flex items-center justify-center gap-2">
            Start <ArrowRight className="h-6 w-6" />
          </button>
          <HelpButton />
        </div>
      )}

      {step === "recipient" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold">Who do you want to pay?</h2>
          <p className="text-base text-muted-foreground">Tap a person below.</p>
          <div className="grid grid-cols-2 gap-3">
            {contacts.map(c => (
              <button
                key={c.name}
                onClick={() => { setRecipient(c); setStep("amount"); }}
                className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-card border-2 border-border active:bg-muted active:border-primary"
              >
                <span className={`h-20 w-20 rounded-full flex items-center justify-center text-3xl font-extrabold ${c.color}`}>{c.initial}</span>
                <span className="text-base font-bold text-center">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.relation}</span>
              </button>
            ))}
          </div>
          <HelpButton />
        </div>
      )}

      {step === "amount" && recipient && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary-soft">
            <span className={`h-12 w-12 rounded-full flex items-center justify-center text-xl font-extrabold ${recipient.color}`}>{recipient.initial}</span>
            <div>
              <p className="text-xs text-foreground/70">Paying</p>
              <p className="text-lg font-extrabold">{recipient.name}</p>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-center">How much?</h2>
          <div className="text-center py-4 rounded-3xl bg-card border-2 border-border">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold text-muted-foreground">RM</span>
              <span className="text-6xl font-extrabold">{amount || "0"}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => k === "" ? <span key={i}/> : (
              <button
                key={k}
                onClick={() => {
                  if (k === "⌫") setAmount(amount.slice(0, -1));
                  else if (amount.length < 5) setAmount(amount + k);
                }}
                className="h-20 rounded-2xl text-3xl font-extrabold bg-card border-2 border-border shadow-sm active:bg-muted active:border-primary"
              >{k}</button>
            ))}
          </div>
          <button
            disabled={!Number(amount)}
            onClick={() => setStep("confirm")}
            className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-extrabold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Continue <ArrowRight className="h-6 w-6" />
          </button>
          <button onClick={() => setStep("recipient")} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground text-base font-bold flex items-center justify-center gap-2">
            <ArrowLeft className="h-5 w-5"/> Back
          </button>
        </div>
      )}

      {step === "confirm" && recipient && (
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-center">Please check</h2>
          <div className="rounded-3xl bg-card border-2 border-border p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl font-extrabold ${recipient.color}`}>{recipient.initial}</span>
              <div>
                <p className="text-sm text-muted-foreground">Sending to</p>
                <p className="text-xl font-extrabold">{recipient.name}</p>
              </div>
            </div>
            <div className="border-t-2 border-border pt-3 space-y-3 text-lg">
              <Row k="Amount" v={fmtRM(Number(amount))} />
              <Row k="Fee" v="Free" />
              <Row k="Total" v={fmtRM(Number(amount) + fee)} bold />
            </div>
          </div>
          <div className="rounded-2xl bg-primary-soft p-4 flex gap-3 items-start">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <p className="text-base font-semibold">Your money is safe. Tap the green button to send.</p>
          </div>
          <button onClick={submit} className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-extrabold shadow-lg">
            Confirm Payment
          </button>
          <button onClick={() => setStep("amount")} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground text-base font-bold flex items-center justify-center gap-2">
            <ArrowLeft className="h-5 w-5"/> Back
          </button>
          <HelpButton />
        </div>
      )}

      {step === "offline" && recipient && (
        <div className="flex flex-col items-center text-center pt-6 px-2">
          <div className="h-28 w-28 rounded-full bg-warning/20 flex items-center justify-center relative">
            <WifiOff className="h-14 w-14 text-warning-foreground" />
            <Loader2 className="h-28 w-28 absolute text-warning-foreground/50 animate-spin" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold">Connection is weak</h2>
          <div className="mt-4 space-y-2 max-w-xs">
            <p className="text-lg font-semibold">Your payment is safely stored.</p>
            <p className="text-base text-muted-foreground">It will automatically complete when internet returns.</p>
          </div>

          <div className="mt-6 w-full rounded-2xl bg-card border-2 border-warning/40 p-4 flex items-center gap-3">
            <Loader2 className="h-6 w-6 text-warning-foreground animate-spin" />
            <div className="flex-1 text-left">
              <p className="text-base font-extrabold">Pending — {fmtRM(Number(amount))}</p>
              <p className="text-sm text-muted-foreground">to {recipient.name}</p>
            </div>
            <span className="text-[11px] font-bold uppercase px-2 py-1 rounded bg-warning/30 text-warning-foreground">Syncing</span>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">Reconnecting…</p>
          <HelpButton />
        </div>
      )}

      {step === "success" && recipient && (
        <div className="flex flex-col items-center text-center pt-6 px-2">
          <div className="h-28 w-28 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="h-16 w-16 text-success" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold">Payment Completed</h2>
          <p className="mt-2 text-base text-muted-foreground">You sent</p>
          <p className="text-5xl font-extrabold text-primary mt-2">{fmtRM(Number(amount))}</p>
          <p className="text-base text-muted-foreground">to {recipient.name}</p>

          <div className="mt-6 w-full rounded-2xl bg-primary-soft p-4 flex items-center gap-3">
            <Wifi className="h-6 w-6 text-primary" />
            <div className="flex-1 text-left">
              <p className="text-sm text-foreground/80">New wallet balance</p>
              <p className="text-2xl font-extrabold text-primary">{fmtRM(balance)}</p>
            </div>
          </div>

          <div className="mt-6 w-full space-y-3">
            <button onClick={() => nav({ to: "/home" })} className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-extrabold">Done</button>
            <button onClick={() => nav({ to: "/transactions" })} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground text-base font-bold">View History</button>
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
      <span className={bold ? "font-extrabold text-primary text-2xl" : "font-bold text-foreground"}>{v}</span>
    </div>
  );
}
