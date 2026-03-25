import { useApp, DemandStatus } from "@/store/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const ALL_STATUSES: DemandStatus[] = ["CREATED", "VALIDATED", "ASSIGNED", "DELIVERED", "VERIFIED", "PAYMENT_PENDING"];

export default function AdminPage() {
  const { demands, assignments, bdsps, overrideStatus } = useApp();

  const rejectedAssignments = assignments.filter(a => a.status === "ACTIVE" && a.deliveredAt === undefined && a.createdAt < new Date(Date.now() - 86400000).toISOString());
  const stuckDemands = demands.filter(d => d.status === "VALIDATED" && !d.matchedBdspId);

  const handleOverride = (demandId: string, status: string) => {
    overrideStatus(demandId, status as DemandStatus);
    toast.info(`Status overridden to ${status}`);
  };

  const getBdspName = (id: string) => bdsps.find(b => b.id === id)?.name || id;

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> Admin Panel</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage exceptions and override statuses</p>
      </div>

      {(rejectedAssignments.length > 0 || stuckDemands.length > 0) && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
          <h2 className="font-heading font-semibold text-destructive flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5" /> Exception Queue
          </h2>
          {stuckDemands.map(d => (
            <div key={d.id} className="text-sm py-2 border-b border-destructive/10 last:border-0">
              <span className="font-medium">{d.serviceType}</span> — Stuck at VALIDATED (no match)
            </div>
          ))}
          {rejectedAssignments.length === 0 && stuckDemands.length === 0 && (
            <p className="text-sm text-muted-foreground">No exceptions</p>
          )}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-heading font-semibold">All Demands — Status Override</h2>
        {demands.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="bg-card rounded-xl p-4 shadow-sm border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{d.serviceType}</span>
              <span className="text-xs text-muted-foreground">{d.organization}</span>
              <StatusBadge status={d.status} />
            </div>
            <Select value={d.status} onValueChange={v => handleOverride(d.id, v)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
