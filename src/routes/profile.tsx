import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useStore, store } from "@/lib/kp/store";
import { Globe, Lock, HelpCircle, Users, LogOut, ChevronRight, Phone } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const user = useStore(s => s.user);
  const lang = useStore(s => s.language);
  return (
    <Shell title="Profil">
      <div className="flex items-center gap-4 p-4 rounded-3xl bg-primary-soft">
        <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-extrabold">A</div>
        <div className="min-w-0">
          <p className="font-extrabold text-lg truncate">{user.name}</p>
          <p className="text-sm text-foreground/70 flex items-center gap-1"><Phone className="h-3.5 w-3.5"/>{user.phone}</p>
        </div>
      </div>

      <Section title="Bahasa / Language">
        <div className="flex p-1 rounded-2xl bg-muted">
          <button onClick={()=>store.set({language:"ms"})} className={`flex-1 h-11 rounded-xl text-sm font-bold ${lang==="ms"?"bg-card shadow":"text-muted-foreground"}`}>🇲🇾 Bahasa Malaysia</button>
          <button onClick={()=>store.set({language:"en"})} className={`flex-1 h-11 rounded-xl text-sm font-bold ${lang==="en"?"bg-card shadow":"text-muted-foreground"}`}>🇬🇧 English</button>
        </div>
      </Section>

      <Section title="Tetapan">
        <List>
          <Item to="/profile" icon={Lock} label="Tukar PIN" sub="Kemas kini PIN 4 angka anda"/>
          <Item to="/agent" icon={Users} label="Ejen Tempatan Saya" sub="Encik Ramli · Kg. Sandakan"/>
          <Item to="/help" icon={HelpCircle} label="Bantuan & Sokongan" sub="Soalan lazim, hubungi kami"/>
          <Item to="/profile" icon={Globe} label="Tentang KampungPay" sub="Versi 1.0.0"/>
        </List>
      </Section>

      <Link to="/login" className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-destructive/10 text-destructive font-bold mt-4">
        <LogOut className="h-5 w-5"/> Log Keluar
      </Link>
      <p className="text-center text-xs text-muted-foreground mt-6">Bayar. Mudah. Bersama. 💚</p>
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
