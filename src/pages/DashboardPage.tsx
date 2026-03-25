import { useApp } from "@/store/AppContext";
import { motion } from "framer-motion";
import { PipelineVisualization } from "@/components/PipelineVisualization";
import {
  Package, Users, CheckCircle, DollarSign, TrendingUp, Clock,
  ArrowUpRight, ArrowDownRight, Activity, Target, BarChart3,
  Zap, ShieldCheck, AlertTriangle, FileText, MapPin
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from "recharts";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const StatCard = ({
  icon: Icon, label, value, subtitle, trend, trendUp, color, accentColor
}: {
  icon: any; label: string; value: string | number; subtitle?: string;
  trend?: string; trendUp?: boolean; color: string; accentColor: string;
}) => (
  <motion.div {...fadeUp} className="bg-card rounded-2xl p-5 shadow-sm border hover:shadow-lg transition-all hover:-translate-y-0.5 group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${accentColor} blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            trendUp ? "bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]" : "bg-destructive/10 text-destructive"
          }`}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-heading font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{subtitle}</p>}
    </div>
  </motion.div>
);

const CHART_COLORS = [
  "hsl(191, 96%, 16%)",
  "hsl(25, 83%, 53%)",
  "hsl(152, 60%, 40%)",
  "hsl(210, 80%, 55%)",
  "hsl(340, 70%, 55%)",
];

export default function DashboardPage() {
  const { demands, assignments, bdsps, events } = useApp();

  const pipelineCounts: Record<string, number> = {};
  demands.forEach(d => {
    const key = d.status === "PAYMENT_PENDING" || d.status === "PAID" ? "PAYMENT" : d.status;
    pipelineCounts[key] = (pipelineCounts[key] || 0) + 1;
  });

  const totalDemands = demands.length;
  const activeAssignments = assignments.filter(a => a.status === "ACTIVE").length;
  const pendingQA = assignments.filter(a => a.status === "DELIVERED").length;
  const pendingPayment = assignments.filter(a => a.status === "VERIFIED" || a.status === "PAYMENT_PENDING").length;
  const totalBDSPs = bdsps.filter(b => b.status === "ACTIVE").length;
  const totalBudget = demands.reduce((s, d) => s + d.budget, 0);
  const avgScore = bdsps.length > 0 ? (bdsps.reduce((s, b) => s + b.score, 0) / bdsps.length).toFixed(1) : "0";

  const completedCount = assignments.filter(a => ["VERIFIED", "PAYMENT_PENDING", "PAID"].includes(a.status)).length;
  const completionRate = assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 0;
  const qaApprovalRate = 85;

  const completionData = [
    { name: "Completed", value: completedCount },
    { name: "In Progress", value: assignments.filter(a => a.status === "ACTIVE").length },
    { name: "Delivered", value: assignments.filter(a => a.status === "DELIVERED").length },
    { name: "Pending", value: assignments.filter(a => a.status === "PENDING").length },
  ].filter(d => d.value > 0);

  const monthlyData = [
    { month: "Sep", demands: 5, completed: 4, budget: 22000 },
    { month: "Oct", demands: 8, completed: 6, budget: 35000 },
    { month: "Nov", demands: 12, completed: 9, budget: 48000 },
    { month: "Dec", demands: 15, completed: 11, budget: 62000 },
    { month: "Jan", demands: totalDemands, completed: completedCount, budget: totalBudget },
  ];

  const performanceData = [
    { name: "Week 1", efficiency: 72, quality: 80 },
    { name: "Week 2", efficiency: 78, quality: 85 },
    { name: "Week 3", efficiency: 85, quality: 82 },
    { name: "Week 4", efficiency: 82, quality: 90 },
  ];

  const locationData = demands.reduce((acc, d) => {
    acc[d.location] = (acc[d.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const locationChartData = Object.entries(locationData).map(([name, value]) => ({ name, value }));

  const serviceData = demands.reduce((acc, d) => {
    acc[d.serviceType] = (acc[d.serviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const serviceChartData = Object.entries(serviceData).map(([name, value]) => ({ name, value }));

  const topBDSPs = [...bdsps].sort((a, b) => b.score - a.score).slice(0, 4);

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <motion.h1 {...fadeUp} className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.05 }} className="text-muted-foreground text-sm mt-1">
            Real-time overview of the IMARA execution pipeline
          </motion.p>
        </div>
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="flex items-center gap-2 text-xs text-muted-foreground bg-card border rounded-lg px-3 py-2">
          <Activity className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
          <span>System Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
        </motion.div>
      </div>

      {/* Stat Cards - 6 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Package} label="Total Demands" value={totalDemands} trend="+20%" trendUp color="bg-primary/10 text-primary" accentColor="bg-primary" />
        <StatCard icon={Users} label="Active BDSPs" value={totalBDSPs} subtitle={`${bdsps.length} total registered`} color="bg-secondary/10 text-secondary" accentColor="bg-secondary" />
        <StatCard icon={Target} label="Active Jobs" value={activeAssignments} trend="+2" trendUp color="bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]" accentColor="bg-[hsl(var(--warning))]" />
        <StatCard icon={CheckCircle} label="Pending QA" value={pendingQA} color="bg-[hsl(210,80%,55%)]/10 text-[hsl(210,80%,55%)]" accentColor="bg-[hsl(210,80%,55%)]" />
        <StatCard icon={DollarSign} label="Total Budget" value={`$${(totalBudget / 1000).toFixed(0)}K`} subtitle="Across all demands" color="bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]" accentColor="bg-[hsl(var(--success))]" />
        <StatCard icon={Zap} label="Completion" value={`${completionRate}%`} trend={completionRate > 50 ? "On Track" : "Behind"} trendUp={completionRate > 50} color="bg-primary/10 text-primary" accentColor="bg-primary" />
      </div>

      {/* Pipeline Visualization */}
      <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="bg-card rounded-2xl p-6 shadow-sm border">
        <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" /> Execution Pipeline
        </h2>
        <PipelineVisualization counts={pipelineCounts} />
      </motion.div>

      {/* Charts Row 1: Monthly + Completion + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-sm border lg:col-span-2">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4 text-primary" /> Monthly Demand & Completion Trends
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorDemands" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(191,96%,16%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(191,96%,16%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(25,83%,53%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(25,83%,53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200,15%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid hsl(200,15%,88%)" }} />
              <Area type="monotone" dataKey="demands" stroke="hsl(191,96%,16%)" fill="url(#colorDemands)" strokeWidth={2} name="Demands" />
              <Area type="monotone" dataKey="completed" stroke="hsl(25,83%,53%)" fill="url(#colorCompleted)" strokeWidth={2} name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="bg-card rounded-2xl p-6 shadow-sm border">
          <h3 className="font-heading font-semibold mb-4 text-sm">Assignment Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={completionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {completionData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {completionData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-muted-foreground truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2: Performance + Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 shadow-sm border">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-secondary" /> Weekly Performance Index
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200,15%,88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="efficiency" stroke="hsl(191,96%,16%)" strokeWidth={2} dot={{ fill: "hsl(191,96%,16%)", r: 4 }} name="Efficiency" />
              <Line type="monotone" dataKey="quality" stroke="hsl(25,83%,53%)" strokeWidth={2} dot={{ fill: "hsl(25,83%,53%)", r: 4 }} name="Quality" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.35 }} className="bg-card rounded-2xl p-6 shadow-sm border space-y-5">
          <h3 className="font-heading font-semibold flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-[hsl(var(--success))]" /> Key Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Completion Rate</span>
                <span className="text-xs font-bold text-foreground">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2.5 rounded-full" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">QA Approval Rate</span>
                <span className="text-xs font-bold text-foreground">{qaApprovalRate}%</span>
              </div>
              <Progress value={qaApprovalRate} className="h-2.5 rounded-full" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">BDSP Utilization</span>
                <span className="text-xs font-bold text-foreground">{Math.round((activeAssignments / Math.max(totalBDSPs, 1)) * 100)}%</span>
              </div>
              <Progress value={Math.round((activeAssignments / Math.max(totalBDSPs, 1)) * 100)} className="h-2.5 rounded-full" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Payment Processing</span>
                <span className="text-xs font-bold text-foreground">{pendingPayment > 0 ? `${pendingPayment} pending` : "All clear"}</span>
              </div>
              <Progress value={pendingPayment > 0 ? 60 : 100} className="h-2.5 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Location distribution + Services + Top BDSPs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 shadow-sm border">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" /> Demand by Location
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={locationChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200,15%,88%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="value" fill="hsl(191,96%,16%)" radius={[0, 6, 6, 0]} name="Demands" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.45 }} className="bg-card rounded-2xl p-6 shadow-sm border">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-secondary" /> Services Requested
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={serviceChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {serviceChartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {serviceChartData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="bg-card rounded-2xl p-6 shadow-sm border">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" /> Top Performing BDSPs
          </h3>
          <div className="space-y-3">
            {topBDSPs.map((b, i) => (
              <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  i === 0 ? "bg-secondary/20 text-secondary" : "bg-primary/10 text-primary"
                }`}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">{b.location}</p>
                </div>
                <span className="text-xs font-bold text-foreground">{b.score}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div {...fadeUp} transition={{ delay: 0.55 }} className="bg-card rounded-2xl p-6 shadow-sm border">
        <h3 className="font-heading font-semibold mb-4 flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-secondary" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {recentEvents.map((ev, i) => (
            <div key={ev.id} className="flex items-start gap-3 group">
              <div className="relative">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  ev.action.includes("Approved") || ev.action.includes("Verified") ? "bg-[hsl(var(--success))]" :
                  ev.action.includes("Rejected") ? "bg-destructive" :
                  ev.action.includes("Payment") ? "bg-secondary" : "bg-primary"
                }`} />
                {i < recentEvents.length - 1 && (
                  <div className="absolute left-[3px] top-3 w-0.5 h-full bg-border" />
                )}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{ev.action}</span>
                  <span className="text-[10px] text-muted-foreground">{ev.actor}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{ev.details}</p>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                  {new Date(ev.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* App Description Footer */}
      <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-primary to-[hsl(195,50%,12%)] rounded-2xl p-8 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-[10%] w-40 h-40 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-5 left-[5%] w-32 h-32 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-secondary" /> What is IMARA BD Marketplace?
          </h2>
          <p className="text-sm leading-relaxed text-primary-foreground/80 mb-4">
            <strong>IMARA BD Marketplace v2.0</strong> is an end-to-end execution management platform designed to streamline how 
            development organizations connect with <strong>Business Development Service Providers (BDSPs)</strong> to deliver 
            impactful services to <strong>Micro, Small & Medium Enterprises (MSMEs)</strong> across Ethiopia.
          </p>
          <p className="text-sm leading-relaxed text-primary-foreground/80 mb-4">
            The platform automates the full lifecycle: from <strong>demand creation</strong> by partner organizations (World Bank, USAID, GIZ, AfDB), 
            through intelligent <strong>BDSP matching</strong> based on expertise and capacity, to <strong>assignment tracking</strong>, 
            <strong> evidence-based delivery verification</strong>, <strong>quality assurance</strong>, and <strong>payment triggering</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Target className="h-5 w-5 text-secondary mb-2" />
              <h4 className="text-xs font-bold mb-1">Demand-Driven</h4>
              <p className="text-[10px] text-primary-foreground/60">Organizations create service demands matched to vetted BDSPs automatically.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <ShieldCheck className="h-5 w-5 text-secondary mb-2" />
              <h4 className="text-xs font-bold mb-1">Verified Delivery</h4>
              <p className="text-[10px] text-primary-foreground/60">Every delivery includes geo-tagged evidence reviewed by QA officers.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <DollarSign className="h-5 w-5 text-secondary mb-2" />
              <h4 className="text-xs font-bold mb-1">Accountable Payments</h4>
              <p className="text-[10px] text-primary-foreground/60">Payments only trigger after verified, quality-assured service completion.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
