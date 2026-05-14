import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useStore } from "@/lib/kp/store";
import { Copy, Share2 } from "lucide-react";

export const Route = createFileRoute("/receive")({ component: Receive });

function Receive() {
  const user = useStore(s => s.user);
  return (
    <Shell title="Receive Money" back="/home">
      <div className="rounded-3xl bg-card border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">Share your QR or number to receive payments</p>
        <div className="mx-auto mt-5 h-56 w-56 rounded-2xl bg-foreground p-3">
          <div className="w-full h-full bg-background rounded-lg grid grid-cols-12 grid-rows-12 gap-px p-2">
            {Array.from({length:144}).map((_,i)=>(
              <span key={i} className={`${(i*5+2)%4<2?"bg-foreground":"bg-transparent"} rounded-sm`}/>
            ))}
          </div>
        </div>
        <p className="font-extrabold text-lg mt-4">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.phone}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button className="h-12 rounded-2xl bg-secondary text-secondary-foreground font-bold flex items-center justify-center gap-2"><Copy className="h-4 w-4"/> Copy No.</button>
        <button className="h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"><Share2 className="h-4 w-4"/> Share QR</button>
      </div>
    </Shell>
  );
}
