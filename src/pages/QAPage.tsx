import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Image, MapPin, Clock, User } from "lucide-react";
import { toast } from "sonner";

export default function QAPage() {
  const { assignments, bdsps, demands, approveQA, rejectQA } = useApp();
  const [checklists, setChecklists] = useState<Record<string, { evidenceVisible: boolean; correctLocation: boolean; serviceCompleted: boolean }>>({});

  const delivered = assignments.filter(a => a.status === "DELIVERED");
  const verified = assignments.filter(a => a.status === "VERIFIED");

  const getChecklist = (id: string) => checklists[id] || { evidenceVisible: false, correctLocation: false, serviceCompleted: false };
  const toggleCheck = (id: string, field: string) => {
    setChecklists(prev => ({
      ...prev,
      [id]: { ...getChecklist(id), [field]: !getChecklist(id)[field as keyof typeof prev[""]] },
    }));
  };

  const handleApprove = (id: string) => {
    const cl = getChecklist(id);
    if (!cl.evidenceVisible || !cl.correctLocation || !cl.serviceCompleted) {
      toast.error("Please complete the checklist before approving");
      return;
    }
    approveQA(id, cl);
    toast.success("QA Approved!");
  };

  const handleReject = (id: string) => {
    rejectQA(id);
    toast.info("Assignment rejected, sent back to ACTIVE");
  };

  const getBdspName = (id: string) => bdsps.find(b => b.id === id)?.name || id;
  const getDemand = (id: string) => demands.find(d => d.id === id);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-heading text-2xl font-bold">QA & Verification</h1>
        <p className="text-muted-foreground text-sm mt-1">Review delivered assignments and verify quality</p>
      </div>

      {delivered.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-secondary">Pending Review ({delivered.length})</h2>
          {delivered.map((a, i) => {
            const demand = getDemand(a.demandId);
            const cl = getChecklist(a.id);
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl p-5 shadow-sm border">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold">{demand?.serviceType || a.demandId}</h3>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><User className="h-3.5 w-3.5" /> {getBdspName(a.bdspId)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {a.deliveryTimestamp ? new Date(a.deliveryTimestamp).toLocaleString() : "N/A"}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.deliveryLocation || "N/A"}</p>
                    <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                      <Image className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Evidence photo uploaded</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Verification Checklist</p>
                    {[
                      { key: "evidenceVisible", label: "Evidence visible" },
                      { key: "correctLocation", label: "Correct location" },
                      { key: "serviceCompleted", label: "Service completed" },
                    ].map(item => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={cl[item.key as keyof typeof cl]} onCheckedChange={() => toggleCheck(a.id, item.key)} />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 justify-center">
                    <Button onClick={() => handleApprove(a.id)} className="gap-1"><CheckCircle className="h-4 w-4" /> Approve</Button>
                    <Button variant="destructive" onClick={() => handleReject(a.id)} className="gap-1"><XCircle className="h-4 w-4" /> Reject</Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {delivered.length === 0 && (
        <div className="bg-card rounded-xl p-12 text-center border">
          <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
          <p className="text-muted-foreground">No deliveries pending QA review</p>
        </div>
      )}

      {verified.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-success">Recently Verified ({verified.length})</h2>
          {verified.map(a => (
            <div key={a.id} className="bg-card rounded-xl p-4 shadow-sm border opacity-80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">{getDemand(a.demandId)?.serviceType}</span>
                  <span className="text-muted-foreground text-sm ml-2">• {getBdspName(a.bdspId)}</span>
                </div>
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
