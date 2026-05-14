import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { useStore } from "@/lib/kp/store";
import { TimeText } from "@/lib/kp/TimeText";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

const iconMap = {
  success: { Icon: CheckCircle2, cls: "bg-success/15 text-success" },
  warn: { Icon: AlertTriangle, cls: "bg-warning/20 text-warning-foreground" },
  info: { Icon: Info, cls: "bg-primary-soft text-primary" },
  error: { Icon: XCircle, cls: "bg-destructive/15 text-destructive" },
} as const;

function Notifications() {
  const list = useStore(s => s.notifications);
  return (
    <Shell title="Notifications" back="/home">
      <ul className="space-y-2">
        {list.map(n => {
          const m = iconMap[n.kind];
          return (
            <li key={n.id} className="rounded-2xl bg-card border border-border p-4 flex gap-3">
              <span className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${m.cls}`}><m.Icon className="h-5 w-5"/></span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2"><p className="font-bold text-sm">{n.title}</p><span className="text-[11px] text-muted-foreground shrink-0"><TimeText ts={n.ts} /></span></div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
              </div>
            </li>
          );
        })}
        {list.length===0 && <p className="text-center text-sm text-muted-foreground py-12">No notifications</p>}
      </ul>
    </Shell>
  );
}
