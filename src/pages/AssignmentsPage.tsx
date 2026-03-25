import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, UserCheck, Upload, MapPin, Clock, Star } from "lucide-react";
import { toast } from "sonner";

export default function AssignmentsPage() {
  const { demands, bdsps, assignments, matchBdsp, assignBdsp, submitDelivery } = useApp();
  const [matchResult, setMatchResult] = useState<{ demandId: string; bdspId: string } | null>(null);
  const [deliveryModal, setDeliveryModal] = useState<string | null>(null);

  const validatedDemands = demands.filter(d => d.status === "VALIDATED");

  const handleMatch = (demandId: string) => {
    const bdsp = matchBdsp(demandId);
    if (bdsp) {
      setMatchResult({ demandId, bdspId: bdsp.id });
      toast.info(`Best match: ${bdsp.name} (Score: ${bdsp.score})`);
    } else {
      toast.error("No available BDSP found");
    }
  };

  const handleAssign = () => {
    if (matchResult) {
      assignBdsp(matchResult.demandId, matchResult.bdspId);
      setMatchResult(null);
      toast.success("BDSP assigned successfully!");
    }
  };

  const handleDelivery = (assignmentId: string) => {
    submitDelivery(assignmentId);
    setDeliveryModal(null);
    toast.success("Delivery submitted!");
  };

  const getBdspName = (id: string) => bdsps.find(b => b.id === id)?.name || id;
  const getDemand = (id: string) => demands.find(d => d.id === id);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-heading text-2xl font-bold">Matching & Assignments</h1>
        <p className="text-muted-foreground text-sm mt-1">Match BDSPs to validated demands and manage assignments</p>
      </div>

      {validatedDemands.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2"><Zap className="h-5 w-5 text-secondary" /> Ready for Matching</h2>
          {validatedDemands.map(d => (
            <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-5 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold">{d.serviceType}</h3>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{d.organization} • {d.location} • ${d.budget.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {matchResult?.demandId === d.id ? (
                    <div className="flex items-center gap-2">
                      <div className="bg-success/10 border border-success/20 rounded-lg px-3 py-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-secondary fill-secondary" />
                        <span className="text-sm font-medium">{getBdspName(matchResult.bdspId)}</span>
                      </div>
                      <Button size="sm" onClick={handleAssign} className="gap-1">
                        <UserCheck className="h-3.5 w-3.5" /> Assign
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleMatch(d.id)} className="gap-1">
                      <Zap className="h-3.5 w-3.5" /> Match BDSP
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-heading font-semibold text-foreground">All Assignments</h2>
        <AnimatePresence>
          {assignments.map((a, i) => {
            const demand = getDemand(a.demandId);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading font-semibold">{demand?.serviceType || a.demandId}</h3>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">BDSP: {getBdspName(a.bdspId)} • ${a.amount.toLocaleString()}</p>
                    {a.deliveryTimestamp && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Delivered: {new Date(a.deliveryTimestamp).toLocaleString()}
                        <MapPin className="h-3 w-3 ml-2" /> {a.deliveryLocation}
                      </p>
                    )}
                  </div>
                  {a.status === "ACTIVE" && (
                    <Button size="sm" variant="secondary" onClick={() => setDeliveryModal(a.id)} className="gap-1">
                      <Upload className="h-3.5 w-3.5" /> Submit Delivery
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Dialog open={!!deliveryModal} onOpenChange={() => setDeliveryModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Submit Delivery Evidence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload evidence photo</p>
              <p className="text-xs text-muted-foreground mt-1">(Simulated upload)</p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {new Date().toLocaleString()}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> 9.0054° N, 38.7636° E</span>
            </div>
            <Button onClick={() => deliveryModal && handleDelivery(deliveryModal)} className="w-full">Confirm Delivery</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
