import { useSyncExternalStore } from "react";

export type TxStatus = "completed" | "pending" | "syncing" | "failed";
export type TxType = "sent" | "received" | "merchant" | "cashin" | "cashout";

export interface Tx {
  id: string;
  type: TxType;
  name: string;
  amount: number; // RM
  note?: string;
  ts: number;
  status: TxStatus;
}

export type Connectivity = "online" | "weak" | "offline";

interface State {
  balance: number;
  txs: Tx[];
  connectivity: Connectivity;
  pin: string;
  language: "ms" | "en";
  user: { name: string; phone: string };
  notifications: { id: string; title: string; body: string; ts: number; kind: "success" | "info" | "warn" | "error" }[];
}

const seed: Tx[] = [
  { id: "t1", type: "received", name: "Mak Cik Siti", amount: 80, ts: Date.now() - 3600_000, status: "completed" },
  { id: "t2", type: "merchant", name: "Kedai Runcit Ah Seng", amount: 12.5, ts: Date.now() - 7200_000, status: "completed", note: "Beras & gula" },
  { id: "t3", type: "sent", name: "Adik Hafiz", amount: 50, ts: Date.now() - 86400_000, status: "completed" },
  { id: "t4", type: "received", name: "Pak Long Ahmad", amount: 200, ts: Date.now() - 2 * 86400_000, status: "completed" },
];

let state: State = {
  balance: 348.5,
  txs: seed,
  connectivity: "online",
  pin: "1234",
  language: "ms",
  user: { name: "Amina Binti Abdullah", phone: "+60 13-456 7890" },
  notifications: [
    { id: "n1", title: "Wang diterima", body: "RM80.00 daripada Mak Cik Siti", ts: Date.now() - 3600_000, kind: "success" },
    { id: "n2", title: "Isyarat lemah", body: "Sambungan internet tidak stabil. Transaksi akan disimpan dengan selamat.", ts: Date.now() - 4 * 3600_000, kind: "warn" },
  ],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export const store = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
  set: (patch: Partial<State>) => { state = { ...state, ...patch }; emit(); },
  setConnectivity(c: Connectivity) { state = { ...state, connectivity: c }; emit(); },
  addTx(tx: Omit<Tx, "id" | "ts">) {
    const newTx: Tx = { ...tx, id: "t" + Math.random().toString(36).slice(2, 8), ts: Date.now() };
    state = { ...state, txs: [newTx, ...state.txs] };
    if (newTx.status === "completed") {
      if (newTx.type === "sent" || newTx.type === "merchant" || newTx.type === "cashout") state.balance -= newTx.amount;
      if (newTx.type === "received" || newTx.type === "cashin") state.balance += newTx.amount;
    }
    emit();
    return newTx;
  },
  syncPending() {
    let bal = state.balance;
    const txs = state.txs.map(t => {
      if (t.status === "pending" || t.status === "syncing") {
        if (t.type === "sent" || t.type === "merchant" || t.type === "cashout") bal -= t.amount;
        if (t.type === "received" || t.type === "cashin") bal += t.amount;
        return { ...t, status: "completed" as TxStatus };
      }
      return t;
    });
    state = { ...state, txs, balance: bal };
    emit();
  },
  notify(n: Omit<State["notifications"][number], "id" | "ts">) {
    state = { ...state, notifications: [{ ...n, id: "n" + Math.random().toString(36).slice(2, 6), ts: Date.now() }, ...state.notifications] };
    emit();
  },
};

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(store.subscribe, () => sel(state), () => sel(state));
}

export function fmtRM(n: number) {
  return "RM" + n.toFixed(2);
}

export function fmtTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-MY", { day: "2-digit", month: "short" });
}
