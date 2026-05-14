import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/kp/Shell";
import { User, Phone, IdCard, HelpCircle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState("");

  return (
    <Shell title="Create Account" back="/onboarding" hideNav right={<Link to="/agent" className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary-soft px-3 py-1.5 rounded-full"><HelpCircle className="h-3.5 w-3.5"/> Need help?</Link>}>
      <div className="space-y-5">
        <div className="flex gap-1.5">
          {[0,1,2].map(i => <span key={i} className={`h-1.5 flex-1 rounded-full ${i<=step?"bg-primary":"bg-border"}`}/>)}
        </div>

        {step===0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Your Details</h2>
            <Field icon={User} label="Full Name" placeholder="e.g. Amina Binti Abdullah" />
            <Field icon={Phone} label="Phone Number" placeholder="+60 13-456 7890" type="tel" />
            <button onClick={()=>setStep(1)} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">Next</button>
          </div>
        )}

        {step===1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Set a 4-digit PIN</h2>
            <p className="text-sm text-muted-foreground">This PIN protects every transaction. Never share it with anyone.</p>
            <div className="flex justify-center gap-3 my-6">
              {[0,1,2,3].map(i=> <div key={i} className={`h-14 w-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold ${pin.length>i?"bg-primary-soft border-primary text-primary":"bg-muted border-border"}`}>{pin.length>i?"●":""}</div>)}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k,i)=>(
                <button key={i} disabled={!k} onClick={()=> k==="⌫" ? setPin(pin.slice(0,-1)) : pin.length<4 && setPin(pin+k)}
                  className={`h-16 rounded-2xl text-2xl font-bold ${k?"bg-card shadow-sm active:bg-muted":"opacity-0"}`}>{k}</button>
              ))}
            </div>
            <button disabled={pin.length<4} onClick={()=>setStep(2)} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold disabled:opacity-50">Confirm PIN</button>
          </div>
        )}

        {step===2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">ID Verification (Optional)</h2>
            <p className="text-sm text-muted-foreground">You can skip this. A local agent can help verify your ID later.</p>
            <Field icon={IdCard} label="National ID Number" placeholder="Optional" />
            <div className="rounded-2xl bg-primary-soft p-4 flex gap-3">
              <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
              <p className="text-sm text-foreground">Your information is stored securely. Only you can access this account.</p>
            </div>
            <button onClick={()=>nav({to:"/home"})} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">Activate Account</button>
            <Link to="/home" className="block text-center text-sm text-muted-foreground">Skip for now</Link>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Field({icon:Icon,label,placeholder,type="text"}:{icon:any;label:string;placeholder:string;type?:string}){
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-3 h-14 px-4 rounded-2xl bg-card border border-border focus-within:border-primary">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <input type={type} placeholder={placeholder} className="flex-1 bg-transparent outline-none text-base" />
      </div>
    </label>
  );
}
