import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import logo from "@/assets/kampungpay-logo.png";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav({ to: "/onboarding" }), 1800);
    return () => clearTimeout(t);
  }, [nav]);
  return (
    <div className="mx-auto max-w-md min-h-dvh flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="absolute inset-0 -z-0 opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(60% 50% at 50% 30%, var(--primary-soft), transparent 70%)" }} />
      <img src={logo} alt="KampungPay" className="h-44 w-44 animate-in fade-in zoom-in duration-700" />
      <p className="mt-2 text-lg font-semibold text-primary">Bayar. Mudah. Bersama.</p>
      <p className="mt-8 text-xs text-muted-foreground">Untuk komuniti Sabah & Sarawak</p>
      <Link to="/onboarding" className="mt-6 text-xs text-muted-foreground underline">Langkau</Link>
    </div>
  );
}
