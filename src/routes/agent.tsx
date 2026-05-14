import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useState } from "react";
import { UserPlus, Banknote, ShieldCheck, MapPin, Phone, CheckCircle2, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { store, fmtRM } from "@/lib/kp/store";

export const Route = createFileRoute("/agent")({ component: Agent });

function Agent() {
  const [tab, setTab] = useState<"help"|"agent">("help");
  return (
    <Shell title="Ejen Tempatan">
      <div className="flex p-1 rounded-2xl bg-muted mb-4">
        <button onClick={()=>setTab("help")} className={`flex-1 h-10 rounded-xl text-sm font-bold ${tab==="help"?"bg-card shadow":"text-muted-foreground"}`}>Cari Ejen</button>
        <button onClick={()=>setTab("agent")} className={`flex-1 h-10 rounded-xl text-sm font-bold ${tab==="agent"?"bg-card shadow":"text-muted-foreground"}`}>Saya Ejen</button>
      </div>
      {tab==="help" ? <Help/> : <AgentDashboard/>}
    </Shell>
  );
}

function Help() {
  const agents = [
    { name: "Encik Ramli", loc: "Kedai Runcit Ramli, Kg. Sandakan", phone: "+60 13-444 5566", dist: "0.4 km" },
    { name: "Puan Norah", loc: "Pasar Mini Norah, Kuching", phone: "+60 19-222 7788", dist: "1.2 km" },
    { name: "Pak Joseph", loc: "Kedai Joseph, Sibu", phone: "+60 11-888 9900", dist: "2.1 km" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-primary-soft p-4 flex gap-3">
        <ShieldCheck className="h-6 w-6 text-primary shrink-0"/>
        <div>
          <p className="font-bold text-sm">Ejen KampungPay yang dipercayai</p>
          <p className="text-xs text-foreground/80 mt-0.5">Mereka boleh bantu anda daftar, tambah nilai tunai, dan jawab soalan.</p>
        </div>
      </div>
      <ul className="space-y-3">
        {agents.map(a=>(
          <li key={a.phone} className="rounded-2xl bg-card border border-border p-4">
            <div className="flex items-start gap-3">
              <span className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">{a.name.split(" ").pop()?.[0]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="font-bold">{a.name}</p><span className="text-[10px] font-bold text-success bg-success/15 px-1.5 py-0.5 rounded">DISAHKAN</span></div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3"/>{a.loc}</p>
                <p className="text-xs text-muted-foreground">{a.dist} dari anda</p>
              </div>
            </div>
            <a href={`tel:${a.phone}`} className="mt-3 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold"><Phone className="h-4 w-4"/> Hubungi {a.phone}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AgentDashboard() {
  const [op, setOp] = useState<null|"register"|"cashin"|"cashout">(null);
  const [done, setDone] = useState(false);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");

  if (done) return (
    <div className="flex flex-col items-center text-center pt-10">
      <div className="h-24 w-24 rounded-full bg-success/20 flex items-center justify-center"><CheckCircle2 className="h-14 w-14 text-success"/></div>
      <h2 className="mt-5 text-xl font-extrabold">Berjaya!</h2>
      <p className="mt-2 text-sm text-muted-foreground">{op==="register"?`Akaun untuk ${name||"pelanggan"} telah diaktifkan.`:op==="cashin"?`Tambah nilai ${fmtRM(Number(amount)||0)} berjaya.`:`Pengeluaran ${fmtRM(Number(amount)||0)} berjaya.`}</p>
      <button onClick={()=>{setDone(false); setOp(null); setAmount(""); setName("");}} className="mt-8 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold">Selesai</button>
    </div>
  );

  if (!op) return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5 text-primary-foreground" style={{ background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.12 145))" }}>
        <p className="text-xs uppercase tracking-wider opacity-90">Komisen Hari Ini</p>
        <p className="text-3xl font-extrabold mt-1">RM24.50</p>
        <p className="text-xs opacity-90 mt-1">7 transaksi diselesaikan</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <AgentAction onClick={()=>setOp("register")} icon={UserPlus} title="Bantu Daftar Pengguna Baharu" desc="Daftarkan jiran kampung dengan beberapa langkah mudah"/>
        <AgentAction onClick={()=>setOp("cashin")} icon={ArrowDownToLine} title="Tambah Nilai Tunai" desc="Terima tunai dan tambah ke dompet pengguna"/>
        <AgentAction onClick={()=>setOp("cashout")} icon={ArrowUpFromLine} title="Pengeluaran Tunai" desc="Bayar tunai daripada dompet pengguna"/>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{op==="register"?"Daftar Pengguna Baharu":op==="cashin"?"Tambah Nilai Tunai":"Pengeluaran Tunai"}</h2>
      {op==="register" ? (
        <>
          <Input label="Nama Penuh Pelanggan" value={name} onChange={setName} placeholder="Cth: Mak Cik Aminah"/>
          <Input label="No. Telefon" placeholder="+60 1X-XXX XXXX"/>
          <div className="rounded-2xl bg-primary-soft p-4 text-sm">
            <p className="font-bold mb-1">📋 Langkah seterusnya</p>
            <ol className="list-decimal list-inside text-foreground/80 space-y-0.5 text-xs">
              <li>SMS pengesahan akan dihantar ke no. telefon</li>
              <li>Bantu pelanggan tetapkan PIN 4 angka</li>
              <li>Akaun siap digunakan!</li>
            </ol>
          </div>
        </>
      ) : (
        <>
          <Input label="No. Telefon Pengguna" placeholder="+60 1X-XXX XXXX"/>
          <Input label={`Jumlah ${op==="cashin"?"Tunai Diterima":"Pengeluaran"}`} value={amount} onChange={setAmount} placeholder="0.00" type="tel"/>
          <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
            <Banknote className="h-6 w-6 text-primary"/>
            <div className="text-sm"><p className="font-bold">{op==="cashin"?"Pengguna serah tunai":"Bayar tunai kepada pengguna"}</p><p className="text-xs text-muted-foreground">Yuran ejen: 1% (RM{((Number(amount)||0)*0.01).toFixed(2)})</p></div>
          </div>
        </>
      )}
      <button onClick={()=>{ if(op==="cashin"&&Number(amount)) store.addTx({type:"cashin",name:"Pelanggan Tempatan",amount:Number(amount),status:"completed"}); setDone(true);}} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold">Sahkan</button>
      <button onClick={()=>setOp(null)} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">Batal</button>
    </div>
  );
}

function AgentAction({onClick,icon:Icon,title,desc}:any){
  return (
    <button onClick={onClick} className="text-left p-4 rounded-2xl bg-card border border-border flex items-center gap-3 active:bg-muted">
      <span className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center shrink-0"><Icon className="h-6 w-6 text-primary"/></span>
      <span className="flex-1"><p className="font-bold text-sm">{title}</p><p className="text-xs text-muted-foreground mt-0.5">{desc}</p></span>
    </button>
  );
}
function Input({label,placeholder,value,onChange,type="text"}:any){
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input type={type} value={value??""} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder} className="mt-1.5 w-full h-14 px-4 rounded-2xl bg-card border border-border outline-none text-base focus:border-primary"/>
    </label>
  );
}
