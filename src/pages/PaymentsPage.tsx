import { useApp } from "@/store/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function PaymentsPage() {
  const { assignments, bdsps, demands, triggerPayment } = useApp();

  const verified = assignments.filter(a => a.status === "VERIFIED");
  const paymentPending = assignments.filter(a => a.status === "PAYMENT_PENDING");

  const getBdspName = (id: string) => bdsps.find(b => b.id === id)?.name || id;
  const getDemand = (id: string) => demands.find(d => d.id === id);

  const handlePayment = (id: string) => {
    triggerPayment(id);
    toast.success("Payment triggered!");
  };

  const totalPending = [...verified, ...paymentPending].reduce((s, a) => s + a.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage payment triggers for verified assignments</p>
        </div>
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <p className="text-xs text-muted-foreground">Total Pending</p>
          <p className="text-2xl font-heading font-bold text-foreground">${totalPending.toLocaleString()}</p>
        </div>
      </div>

      {verified.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold flex items-center gap-2"><DollarSign className="h-5 w-5 text-success" /> Ready for Payment ({verified.length})</h2>
          {verified.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl p-5 shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold">{getDemand(a.demandId)?.serviceType || a.demandId}</h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{getBdspName(a.bdspId)} • ${a.amount.toLocaleString()}</p>
                </div>
                <Button onClick={() => handlePayment(a.id)} className="gap-1"><CreditCard className="h-4 w-4" /> Trigger Payment</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {paymentPending.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Payment Processing ({paymentPending.length})</h2>
          {paymentPending.map(a => (
            <div key={a.id} className="bg-card rounded-xl p-5 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{getDemand(a.demandId)?.serviceType}</span>
                  <span className="text-muted-foreground text-sm ml-2">• {getBdspName(a.bdspId)} • ${a.amount.toLocaleString()}</span>
                </div>
                <StatusBadge status="PAYMENT_PENDING" />
              </div>
            </div>
          ))}
        </div>
      )}

      {verified.length === 0 && paymentPending.length === 0 && (
        <div className="bg-card rounded-xl p-12 text-center border">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No payments pending</p>
        </div>
      )}
    </div>
  );
}
