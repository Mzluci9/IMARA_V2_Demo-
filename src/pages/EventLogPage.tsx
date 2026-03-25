import { useApp } from "@/store/AppContext";
import { motion } from "framer-motion";
import { ScrollText, Clock } from "lucide-react";

const actionColors: Record<string, string> = {
  "Demand Created": "border-l-info",
  "Demand Validated": "border-l-primary",
  "BDSP Assigned": "border-l-secondary",
  "Delivery Submitted": "border-l-warning",
  "QA Approved": "border-l-success",
  "QA Rejected": "border-l-destructive",
  "Payment Triggered": "border-l-primary",
  "Status Override": "border-l-muted-foreground",
};

export default function EventLogPage() {
  const { events } = useApp();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" /> Event Log
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Complete audit trail of all actions</p>
      </div>

      <div className="space-y-2">
        {events.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`bg-card rounded-lg p-4 shadow-sm border border-l-4 ${actionColors[e.action] || "border-l-border"}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{e.action}</p>
                <p className="text-xs text-muted-foreground">{e.details}</p>
                <p className="text-xs text-muted-foreground">Actor: {e.actor}</p>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                <Clock className="h-3 w-3" /> {new Date(e.timestamp).toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
