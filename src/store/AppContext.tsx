import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Types
export type DemandStatus = "CREATED" | "VALIDATED" | "MATCHED" | "ASSIGNED" | "DELIVERED" | "VERIFIED" | "PAYMENT_PENDING" | "PAID";
export type AssignmentStatus = "PENDING" | "ACTIVE" | "DELIVERED" | "VERIFIED" | "PAYMENT_PENDING" | "PAID";

export interface Demand {
  id: string;
  organization: string;
  program: string;
  msmeId: string;
  serviceType: string;
  location: string;
  budget: number;
  status: DemandStatus;
  createdAt: string;
  matchedBdspId?: string;
}

export interface BDSP {
  id: string;
  name: string;
  location: string;
  capacity: number;
  maxCapacity: number;
  score: number;
  status: "ACTIVE" | "INACTIVE";
  specializations: string[];
  topPerformer: boolean;
}

export interface Assignment {
  id: string;
  demandId: string;
  bdspId: string;
  status: AssignmentStatus;
  createdAt: string;
  deliveredAt?: string;
  verifiedAt?: string;
  deliveryImage?: string;
  deliveryLocation?: string;
  deliveryTimestamp?: string;
  amount: number;
  qaChecklist?: { evidenceVisible: boolean; correctLocation: boolean; serviceCompleted: boolean };
}

export interface EventLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  demandId?: string;
  assignmentId?: string;
}

const INITIAL_BDSPS: BDSP[] = [
  { id: "b1", name: "TechBridge Solutions", location: "Addis Ababa", capacity: 3, maxCapacity: 5, score: 4.8, status: "ACTIVE", specializations: ["Digital Literacy", "Financial Training"], topPerformer: true },
  { id: "b2", name: "GreenField Advisors", location: "Hawassa", capacity: 2, maxCapacity: 4, score: 4.5, status: "ACTIVE", specializations: ["Agricultural Training", "Market Access"], topPerformer: true },
  { id: "b3", name: "Urban Skills Academy", location: "Dire Dawa", capacity: 4, maxCapacity: 6, score: 4.2, status: "ACTIVE", specializations: ["Vocational Training", "Business Planning"], topPerformer: false },
  { id: "b4", name: "Sahel Consulting", location: "Bahir Dar", capacity: 1, maxCapacity: 3, score: 3.9, status: "ACTIVE", specializations: ["Financial Training", "Compliance"], topPerformer: false },
  { id: "b5", name: "Impact Partners Ltd", location: "Addis Ababa", capacity: 5, maxCapacity: 7, score: 4.6, status: "ACTIVE", specializations: ["Digital Literacy", "Business Planning"], topPerformer: true },
  { id: "b6", name: "NextGen Trainers", location: "Mekelle", capacity: 0, maxCapacity: 4, score: 3.5, status: "INACTIVE", specializations: ["Vocational Training"], topPerformer: false },
];

const INITIAL_DEMANDS: Demand[] = [
  { id: "d1", organization: "World Bank", program: "MSME Growth", msmeId: "MSME-001", serviceType: "Digital Literacy", location: "Addis Ababa", budget: 5000, status: "VERIFIED", createdAt: "2024-01-15T09:00:00Z", matchedBdspId: "b1" },
  { id: "d2", organization: "USAID", program: "AgriFinance", msmeId: "MSME-002", serviceType: "Agricultural Training", location: "Hawassa", budget: 7500, status: "DELIVERED", createdAt: "2024-01-18T10:30:00Z", matchedBdspId: "b2" },
  { id: "d3", organization: "GIZ", program: "Skills Dev", msmeId: "MSME-003", serviceType: "Vocational Training", location: "Dire Dawa", budget: 4000, status: "ASSIGNED", createdAt: "2024-01-20T14:00:00Z", matchedBdspId: "b3" },
  { id: "d4", organization: "AfDB", program: "FinInclude", msmeId: "MSME-004", serviceType: "Financial Training", location: "Bahir Dar", budget: 6000, status: "VALIDATED", createdAt: "2024-02-01T08:00:00Z" },
  { id: "d5", organization: "World Bank", program: "MSME Growth", msmeId: "MSME-005", serviceType: "Business Planning", location: "Addis Ababa", budget: 3500, status: "CREATED", createdAt: "2024-02-05T11:00:00Z" },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: "a1", demandId: "d1", bdspId: "b1", status: "VERIFIED", createdAt: "2024-01-16T10:00:00Z", deliveredAt: "2024-01-25T15:00:00Z", verifiedAt: "2024-01-26T09:00:00Z", amount: 5000, deliveryImage: "/placeholder.svg", deliveryLocation: "9.0054° N, 38.7636° E", deliveryTimestamp: "2024-01-25T15:00:00Z", qaChecklist: { evidenceVisible: true, correctLocation: true, serviceCompleted: true } },
  { id: "a2", demandId: "d2", bdspId: "b2", status: "DELIVERED", createdAt: "2024-01-19T11:00:00Z", deliveredAt: "2024-01-28T14:00:00Z", amount: 7500, deliveryImage: "/placeholder.svg", deliveryLocation: "7.0621° N, 38.4763° E", deliveryTimestamp: "2024-01-28T14:00:00Z" },
  { id: "a3", demandId: "d3", bdspId: "b3", status: "ACTIVE", createdAt: "2024-01-21T09:00:00Z", amount: 4000 },
];

const INITIAL_EVENTS: EventLog[] = [
  { id: "e1", timestamp: "2024-01-15T09:00:00Z", actor: "System", action: "Demand Created", details: "Digital Literacy demand for MSME-001", demandId: "d1" },
  { id: "e2", timestamp: "2024-01-15T09:30:00Z", actor: "Admin", action: "Demand Validated", details: "Demand d1 validated", demandId: "d1" },
  { id: "e3", timestamp: "2024-01-16T10:00:00Z", actor: "System", action: "BDSP Assigned", details: "TechBridge Solutions assigned to d1", demandId: "d1", assignmentId: "a1" },
  { id: "e4", timestamp: "2024-01-25T15:00:00Z", actor: "TechBridge Solutions", action: "Delivery Submitted", details: "Evidence uploaded for assignment a1", assignmentId: "a1" },
  { id: "e5", timestamp: "2024-01-26T09:00:00Z", actor: "QA Officer", action: "QA Approved", details: "Assignment a1 verified", assignmentId: "a1" },
];

interface AppContextType {
  demands: Demand[];
  bdsps: BDSP[];
  assignments: Assignment[];
  events: EventLog[];
  createDemand: (d: Omit<Demand, "id" | "status" | "createdAt">) => void;
  validateDemand: (id: string) => void;
  matchBdsp: (demandId: string) => BDSP | null;
  assignBdsp: (demandId: string, bdspId: string) => void;
  submitDelivery: (assignmentId: string) => void;
  approveQA: (assignmentId: string, checklist: Assignment["qaChecklist"]) => void;
  rejectQA: (assignmentId: string) => void;
  triggerPayment: (assignmentId: string) => void;
  overrideStatus: (demandId: string, status: DemandStatus) => void;
}

const AppContext = createContext<AppContextType | null>(null);

let idCounter = 100;
const genId = (prefix: string) => `${prefix}${++idCounter}`;
const now = () => new Date().toISOString();

export function AppProvider({ children }: { children: ReactNode }) {
  const [demands, setDemands] = useState<Demand[]>(INITIAL_DEMANDS);
  const [bdsps, setBdsps] = useState<BDSP[]>(INITIAL_BDSPS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [events, setEvents] = useState<EventLog[]>(INITIAL_EVENTS);

  const addEvent = useCallback((actor: string, action: string, details: string, demandId?: string, assignmentId?: string) => {
    setEvents(prev => [{ id: genId("e"), timestamp: now(), actor, action, details, demandId, assignmentId }, ...prev]);
  }, []);

  const createDemand = useCallback((d: Omit<Demand, "id" | "status" | "createdAt">) => {
    const id = genId("d");
    setDemands(prev => [...prev, { ...d, id, status: "CREATED", createdAt: now() }]);
    addEvent("User", "Demand Created", `${d.serviceType} for ${d.msmeId}`, id);
  }, [addEvent]);

  const validateDemand = useCallback((id: string) => {
    setDemands(prev => prev.map(d => d.id === id ? { ...d, status: "VALIDATED" as const } : d));
    addEvent("Admin", "Demand Validated", `Demand ${id} validated`, id);
  }, [addEvent]);

  const matchBdsp = useCallback((demandId: string): BDSP | null => {
    const demand = demands.find(d => d.id === demandId);
    if (!demand) return null;
    const available = bdsps.filter(b => b.status === "ACTIVE" && b.capacity > 0 && b.specializations.includes(demand.serviceType));
    if (available.length === 0) return bdsps.filter(b => b.status === "ACTIVE" && b.capacity > 0).sort((a, b) => b.score - a.score)[0] || null;
    return available.sort((a, b) => b.score - a.score)[0];
  }, [demands, bdsps]);

  const assignBdsp = useCallback((demandId: string, bdspId: string) => {
    const demand = demands.find(d => d.id === demandId);
    if (!demand) return;
    const aId = genId("a");
    setDemands(prev => prev.map(d => d.id === demandId ? { ...d, status: "ASSIGNED" as const, matchedBdspId: bdspId } : d));
    setBdsps(prev => prev.map(b => b.id === bdspId ? { ...b, capacity: Math.max(0, b.capacity - 1) } : b));
    setAssignments(prev => [...prev, { id: aId, demandId, bdspId, status: "ACTIVE", createdAt: now(), amount: demand.budget }]);
    addEvent("System", "BDSP Assigned", `BDSP ${bdspId} assigned to ${demandId}`, demandId, aId);
  }, [demands, addEvent]);

  const submitDelivery = useCallback((assignmentId: string) => {
    const ts = now();
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: "DELIVERED" as const, deliveredAt: ts, deliveryImage: "/placeholder.svg", deliveryLocation: "9.0054° N, 38.7636° E", deliveryTimestamp: ts } : a));
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setDemands(prev => prev.map(d => d.id === assignment.demandId ? { ...d, status: "DELIVERED" as const } : d));
      const bdsp = bdsps.find(b => b.id === assignment.bdspId);
      addEvent(bdsp?.name || "BDSP", "Delivery Submitted", `Evidence uploaded for ${assignmentId}`, assignment.demandId, assignmentId);
    }
  }, [assignments, bdsps, addEvent]);

  const approveQA = useCallback((assignmentId: string, checklist: Assignment["qaChecklist"]) => {
    const ts = now();
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: "VERIFIED" as const, verifiedAt: ts, qaChecklist: checklist } : a));
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setDemands(prev => prev.map(d => d.id === assignment.demandId ? { ...d, status: "VERIFIED" as const } : d));
      addEvent("QA Officer", "QA Approved", `Assignment ${assignmentId} verified`, assignment.demandId, assignmentId);
    }
  }, [assignments, addEvent]);

  const rejectQA = useCallback((assignmentId: string) => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: "ACTIVE" as const, deliveredAt: undefined, deliveryImage: undefined, deliveryLocation: undefined, deliveryTimestamp: undefined } : a));
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setDemands(prev => prev.map(d => d.id === assignment.demandId ? { ...d, status: "ASSIGNED" as const } : d));
      addEvent("QA Officer", "QA Rejected", `Assignment ${assignmentId} rejected, back to ACTIVE`, assignment.demandId, assignmentId);
    }
  }, [assignments, addEvent]);

  const triggerPayment = useCallback((assignmentId: string) => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: "PAYMENT_PENDING" as const } : a));
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setDemands(prev => prev.map(d => d.id === assignment.demandId ? { ...d, status: "PAYMENT_PENDING" as const } : d));
      addEvent("Finance", "Payment Triggered", `Payment of $${assignment.amount} for ${assignmentId}`, assignment.demandId, assignmentId);
    }
  }, [assignments, addEvent]);

  const overrideStatus = useCallback((demandId: string, status: DemandStatus) => {
    setDemands(prev => prev.map(d => d.id === demandId ? { ...d, status } : d));
    addEvent("Admin", "Status Override", `Demand ${demandId} → ${status}`, demandId);
  }, [addEvent]);

  return (
    <AppContext.Provider value={{ demands, bdsps, assignments, events, createDemand, validateDemand, matchBdsp, assignBdsp, submitDelivery, approveQA, rejectQA, triggerPayment, overrideStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
