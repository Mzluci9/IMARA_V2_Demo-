import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  CREATED: "bg-muted text-muted-foreground",
  VALIDATED: "bg-info/15 text-info",
  MATCHED: "bg-info/25 text-info",
  ASSIGNED: "bg-secondary/15 text-secondary",
  ACTIVE: "bg-secondary/15 text-secondary",
  PENDING: "bg-muted text-muted-foreground",
  DELIVERED: "bg-warning/15 text-warning",
  VERIFIED: "bg-success/15 text-success",
  PAYMENT_PENDING: "bg-primary/15 text-primary",
  PAID: "bg-success/20 text-success",
  INACTIVE: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase", statusColors[status] || "bg-muted text-muted-foreground", className)}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
