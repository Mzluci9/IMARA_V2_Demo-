import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const SERVICE_TYPES = ["Digital Literacy", "Agricultural Training", "Vocational Training", "Financial Training", "Business Planning", "Market Access", "Compliance"];

export default function DemandsPage() {
  const { demands, createDemand, validateDemand } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ organization: "", program: "", msmeId: "", serviceType: "", location: "", budget: "" });

  const handleSubmit = () => {
    if (!form.organization || !form.serviceType || !form.msmeId) {
      toast.error("Please fill required fields");
      return;
    }
    createDemand({ ...form, budget: Number(form.budget) || 0 });
    setForm({ organization: "", program: "", msmeId: "", serviceType: "", location: "", budget: "" });
    setOpen(false);
    toast.success("Demand created successfully!");
  };

  const handleValidate = (id: string) => {
    validateDemand(id);
    toast.success("Demand validated!");
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Demand Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage service demands</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create Demand</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">Create New Demand</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Organization *</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="e.g. World Bank" /></div>
                <div><Label>Program</Label><Input value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} placeholder="e.g. MSME Growth" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>MSME ID *</Label><Input value={form.msmeId} onChange={e => setForm(f => ({ ...f, msmeId: e.target.value }))} placeholder="e.g. MSME-006" /></div>
                <div>
                  <Label>Service Type *</Label>
                  <Select value={form.serviceType} onValueChange={v => setForm(f => ({ ...f, serviceType: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{SERVICE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Addis Ababa" /></div>
                <div><Label>Budget ($)</Label><Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="5000" /></div>
              </div>
              <Button onClick={handleSubmit} className="w-full">Create Demand</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {demands.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading font-semibold text-foreground">{d.serviceType}</h3>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{d.organization} • {d.program} • {d.msmeId}</p>
                  <p className="text-sm text-muted-foreground">{d.location} • ${d.budget.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {d.status === "CREATED" && (
                    <Button size="sm" variant="outline" onClick={() => handleValidate(d.id)} className="gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Validate
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
