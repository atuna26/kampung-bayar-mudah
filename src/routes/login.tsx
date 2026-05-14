import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/kampungpay-logo.png";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [pin, setPin] = useState("");
  const onKey = (k: string) => {
    if (k === "⌫") return setPin(pin.slice(0,-1));
    if (pin.length < 4) {
      const next = pin + k;
      setPin(next);
      if (next.length === 4) setTimeout(() => nav({ to: "/home" }), 250);
    }
  };
  return (
    <div className="mx-auto max-w-md min-h-dvh bg-background px-6 pt-10 pb-8 flex flex-col">
      <div className="flex flex-col items-center text-center">
        <img src={logo} alt="KampungPay" className="h-20 w-20 rounded-full" />
        <h1 className="mt-3 text-xl font-extrabold">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Enter your 4-digit PIN</p>
      </div>
      <div className="flex justify-center gap-3 my-8">
        {[0,1,2,3].map(i=> <div key={i} className={`h-14 w-14 rounded-2xl border-2 flex items-center justify-center text-2xl ${pin.length>i?"bg-primary-soft border-primary text-primary":"bg-muted border-border"}`}>{pin.length>i?"●":""}</div>)}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-auto">
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k,i)=>(
          <button key={i} disabled={!k} onClick={()=>onKey(k)} className={`h-16 rounded-2xl text-2xl font-bold ${k?"bg-card shadow-sm active:bg-muted":"opacity-0"}`}>{k}</button>
        ))}
      </div>
      <Link to="/help" className="text-center text-sm text-primary font-semibold mt-6">Forgot PIN? Contact an agent</Link>
    </div>
  );
}
