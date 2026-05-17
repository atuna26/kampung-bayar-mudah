import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useStore, store, TIER_LIMITS, fmtRM } from "@/lib/kp/store";
import { Globe, Lock, HelpCircle, Users, LogOut, ChevronRight, Phone, ShieldCheck, BadgeCheck, Landmark } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const user = useStore(s => s.user);
  const lang = useStore(s => s.language);
  const tier = useStore(s => s.tier);
  const tierInfo = TIER_LIMITS[tier];
  const verify = () => {
    store.set({ tier: "verified" });
    store.notify({ title: "Identity verified", body: "Your wallet is now linked to MyKad. Higher limits unlocked.", kind: "success" });
  };
  return (
    <Shell title="Profile">
      <div className="flex items-center gap-4 p-4 rounded-3xl bg-primary-soft">
        <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-extrabold">A</div>
        <div className="min-w-0">
          <p className="font-extrabold text-lg truncate">{user.name}</p>
          <p className="text-sm text-foreground/70 flex items-center gap-1"><Phone className="h-3.5 w-3.5"/>{user.phone}</p>
          <p className="text-xs mt-1 inline-flex items-center gap-1 font-bold text-primary"><BadgeCheck className="h-3.5 w-3.5"/>{tierInfo.label} account</p>
        </div>
      </div>

      <Section title="Account tier">
        <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Per transaction limit</span>
            <span className="font-bold">{fmtRM(tierInfo.perTx)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Wallet balance limit</span>
            <span className="font-bold">{fmtRM(tierInfo.dailyBalance)}</span>
          </div>
          {tier === "basic" ? (
            <button onClick={verify} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2">
              <BadgeCheck className="h-4 w-4"/> Verify with MyKad
            </button>
          ) : (
            <p className="text-xs text-success font-semibold flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5"/>Linked to MyKad national ID</p>
          )}
          <p className="text-[11px] text-muted-foreground">Start with a basic wallet — no paperwork. Verify with your MyKad later to raise limits.</p>
        </div>
      </Section>

      <Section title="Language">
        <div className="flex p-1 rounded-2xl bg-muted">
          <button onClick={()=>store.set({language:"ms"})} className={`flex-1 h-11 rounded-xl text-sm font-bold ${lang==="ms"?"bg-card shadow":"text-muted-foreground"}`}>🇲🇾 Bahasa Malaysia</button>
          <button onClick={()=>store.set({language:"en"})} className={`flex-1 h-11 rounded-xl text-sm font-bold ${lang==="en"?"bg-card shadow":"text-muted-foreground"}`}>🇬🇧 English</button>
        </div>
      </Section>

      <Section title="Settings">
        <List>
          <Item to="/profile" icon={Lock} label="Change PIN" sub="Update your 4-digit PIN"/>
          <Item to="/agent" icon={Users} label="My Local Agent" sub="Mr. Ramli · Kg. Sandakan"/>
          <Item to="/help" icon={HelpCircle} label="Help & Support" sub="FAQs and contact us"/>
          <Item to="/profile" icon={Globe} label="About KampungPay" sub="Version 1.0.0"/>
        </List>
      </Section>

      <Section title="Security & trust">
        <div className="rounded-2xl bg-card border border-border p-4 space-y-2 text-sm">
          <p className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0"/><span>End-to-end encrypted transactions, PIN + device-level protection.</span></p>
          <p className="flex items-start gap-2"><Landmark className="h-4 w-4 text-primary mt-0.5 shrink-0"/><span>Works with Malaysian banks & DuitNow QR. Regulated under BNM e-money rules.</span></p>
        </div>
      </Section>

      <Link to="/login" className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-destructive/10 text-destructive font-bold mt-4">
        <LogOut className="h-5 w-5"/> Log Out
      </Link>
      <p className="text-center text-xs text-muted-foreground mt-6">Pay. Easy. Together. 💚</p>
    </Shell>
  );
}

function Section({ title, children }: any) {
  return <section className="mt-6 space-y-2"><h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{title}</h3>{children}</section>;
}
function List({ children }: any) { return <ul className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">{children}</ul>; }
function Item({ to, icon: Icon, label, sub }: any) {
  return (
    <li><Link to={to} className="flex items-center gap-3 p-4 active:bg-muted">
      <span className="h-10 w-10 rounded-2xl bg-primary-soft flex items-center justify-center"><Icon className="h-5 w-5 text-primary"/></span>
      <span className="flex-1"><p className="font-semibold text-sm">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></span>
      <ChevronRight className="h-5 w-5 text-muted-foreground"/>
    </Link></li>
  );
}
