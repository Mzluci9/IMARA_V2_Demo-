import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const STEPS = ["CREATED", "VALIDATED", "ASSIGNED", "DELIVERED", "VERIFIED", "PAYMENT"];

const stepColors: Record<string, string> = {
  CREATED: "bg-muted",
  VALIDATED: "bg-info",
  ASSIGNED: "bg-secondary",
  DELIVERED: "bg-warning",
  VERIFIED: "bg-success",
  PAYMENT: "bg-primary",
};

export function PipelineVisualization({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center flex-1"
            >
              <div className={cn("w-full h-2 rounded-full", stepColors[step])} style={{ opacity: 0.3 + (0.7 * (counts[step] || 0)) / total }} />
              <span className="text-[10px] text-muted-foreground mt-1 font-medium">{step}</span>
              <span className="text-sm font-bold text-foreground">{counts[step] || 0}</span>
            </motion.div>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-border mx-0.5 mt-[-14px]" />}
          </div>
        ))}
      </div>
    </div>
  );
}
