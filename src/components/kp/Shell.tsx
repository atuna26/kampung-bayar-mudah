import { Link, useLocation } from "@tanstack/react-router";
import { Home, Send, QrCode, Receipt, User, Wifi, WifiOff, SignalLow, Bell } from "lucide-react";
import { useStore, store } from "@/lib/kp/store";
import logo from "@/assets/kampungpay-logo.png";
import { ReactNode } from "react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/send", label: "Send", icon: Send },
  { to: "/qr", label: "QR", icon: QrCode },
  { to: "/transactions", label: "History", icon: Receipt },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function ConnectivityPill() {
  const c = useStore(s => s.connectivity);
  const map = {
    online: { Icon: Wifi, text: "Online", cls: "bg-success/15 text-success" },
    weak: { Icon: SignalLow, text: "Isyarat Lemah", cls: "bg-warning/20 text-warning-foreground" },
    offline: { Icon: WifiOff, text: "Offline", cls: "bg-destructive/15 text-destructive" },
  } as const;
  const { Icon, text, cls } = map[c];
  return (
    <button
      onClick={() => store.setConnectivity(c === "online" ? "weak" : c === "weak" ? "offline" : "online")}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
      aria-label="Change connection status (demo)"
    >
      <Icon className="h-3.5 w-3.5" />
      {text}
    </button>
  );
}

export function TopBar({ title, right, back }: { title?: string; right?: ReactNode; back?: string }) {
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2 min-w-0">
          {back ? (
            <Link to={back} className="text-primary font-semibold text-sm">‹ Back</Link>
          ) : (
            <img src={logo} alt="KampungPay" className="h-9 w-9 rounded-full" />
          )}
          {title && <h1 className="font-bold text-base truncate">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          {right ?? <ConnectivityPill />}
          <Link to="/notifications" aria-label="Notifications" className="p-2 rounded-full hover:bg-muted">
            <Bell className="h-5 w-5 text-foreground/70" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="sticky bottom-0 z-20 bg-background border-t border-border pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {tabs.map(t => {
          const active = loc.pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className={`flex items-center justify-center h-9 w-12 rounded-2xl ${active ? "bg-primary-soft" : ""}`}>
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Shell({ title, back, right, children, hideNav }: { title?: string; back?: string; right?: ReactNode; children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="kp-frame mx-auto max-w-md flex flex-col min-h-dvh">
      <TopBar title={title} back={back} right={right} />
      <main className="flex-1 px-4 py-4 pb-6">{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
