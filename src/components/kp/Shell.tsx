import { Link, useLocation } from "@tanstack/react-router";
import { Home, Send, QrCode, Receipt, User, Wifi, WifiOff, SignalLow, Bell, CheckCircle2, Zap } from "lucide-react";
import { useStore, store, onSyncSuccess } from "@/lib/kp/store";
import { useT } from "@/lib/kp/i18n";
import logo from "@/assets/kampungpay-logo.png";
import { ReactNode, useEffect, useState } from "react";

const tabs = [
  { to: "/home", key: "Home", icon: Home },
  { to: "/send", key: "Send", icon: Send },
  { to: "/qr", key: "QR", icon: QrCode },
  { to: "/transactions", key: "History", icon: Receipt },
  { to: "/profile", key: "Profile", icon: User },
] as const;

export function ConnectivityPill() {
  const c = useStore(s => s.connectivity);
  const t = useT();
  const map = {
    online: { Icon: Wifi, text: t("Online"), cls: "bg-success/15 text-success" },
    weak: { Icon: SignalLow, text: t("Lite Mode"), cls: "bg-warning/20 text-warning-foreground" },
    offline: { Icon: WifiOff, text: t("Offline"), cls: "bg-destructive/15 text-destructive" },
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
  const t = useT();
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2 min-w-0">
          {back ? (
            <Link to={back} className="text-primary font-semibold text-sm">‹ {t("Back")}</Link>
          ) : (
            <img src={logo} alt="KampungPay" className="h-9 w-9 rounded-full" />
          )}
          {title && <h1 className="font-bold text-base truncate">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          {right ?? <ConnectivityPill />}
          <Link to="/notifications" aria-label={t("Notifications")} className="p-2 rounded-full hover:bg-muted">
            <Bell className="h-5 w-5 text-foreground/70" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const loc = useLocation();
  const t = useT();
  return (
    <nav className="sticky bottom-0 z-20 bg-background border-t border-border pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {tabs.map(tab => {
          const active = loc.pathname.startsWith(tab.to);
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className={`flex items-center justify-center h-9 w-12 rounded-2xl ${active ? "bg-primary-soft" : ""}`}>
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </span>
                {t(tab.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Shell({ title, back, right, children, hideNav }: { title?: string; back?: string; right?: ReactNode; children: ReactNode; hideNav?: boolean }) {
  const conn = useStore(s => s.connectivity);
  const largeText = useStore(s => s.largeText);
  const elderMode = useStore(s => s.elderMode);
  const t = useT();
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  useEffect(() => {
    const off = onSyncSuccess(count => {
      setSyncMsg(t("Transaction synchronized successfully") + ` (${count})`);
      setTimeout(() => setSyncMsg(null), 3500);
    });
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cls = [
    "kp-frame mx-auto max-w-md flex flex-col min-h-dvh",
    largeText ? "text-[112%] leading-relaxed" : "",
    elderMode ? "kp-elder" : "",
  ].join(" ");

  return (
    <div className={cls}>
      <TopBar title={title} back={back} right={right} />
      {conn === "weak" && (
        <div className="px-4 py-2 bg-warning/20 text-warning-foreground text-xs font-semibold flex items-center gap-2 border-b border-warning/30">
          <Zap className="h-3.5 w-3.5 shrink-0" />
          <span><b>{t("Lite Mode Enabled")}.</b> {t("Weak internet — using Lite Mode to save data.")}</span>
        </div>
      )}
      {syncMsg && (
        <div className="px-4 py-2 bg-success/15 text-success text-xs font-bold flex items-center gap-2 border-b border-success/30">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{syncMsg}</span>
        </div>
      )}
      <main className="flex-1 px-4 py-4 pb-6">{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}