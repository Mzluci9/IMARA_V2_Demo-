import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Cpu, Truck, ShieldCheck, Wallet,
  Users, Building2, GraduationCap, ArrowRight,
  Target, Scale, GitBranch, Lock, CheckCircle,
  TrendingUp, MapPin, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/store/AppContext";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  }),
};

const processSteps = [
  { icon: FileText, title: "Demand Created", desc: "Organizations submit structured service demands for MSMEs with clear deliverables and budgets." },
  { icon: Cpu, title: "Smart Matching", desc: "AI-powered engine matches demands to certified BDSPs based on capacity, location, and performance." },
  { icon: Truck, title: "Service Delivery", desc: "Assigned BDSPs execute services on-ground with geo-tagged, time-stamped evidence collection." },
  { icon: ShieldCheck, title: "Quality Verification", desc: "Multi-layer QA process validates delivery evidence against predefined compliance checklists." },
  { icon: Wallet, title: "Performance-Based Payment", desc: "Payments are triggered only after verified delivery ensuring accountability at every step." },
];

const valueCards = [
  {
    icon: Target, title: "Marketplace Matching",
    points: ["Algorithmic BDSP-demand pairing", "Capacity and geo-based filtering", "Performance score weighting"]
  },
  {
    icon: Scale, title: "Governance & QA",
    points: ["Evidence-based verification", "Multi-point compliance checklists", "Rejection and re-assignment workflows"]
  },
  {
    icon: GitBranch, title: "Execution Pipeline",
    points: ["End-to-end status tracking", "Real-time event audit trail", "Exception handling queues"]
  },
  {
    icon: Lock, title: "Secure Payments",
    points: ["Verification-gated disbursement", "Transparent payment audit logs", "Budget tracking per program"]
  },
];

const metrics = [
  { value: "500K+", label: "MSMEs Reached", icon: Users },
  { value: "100+", label: "Certified BDSPs", icon: Award },
  { value: "90%+", label: "QA Compliance", icon: CheckCircle },
  { value: "Nationwide", label: "Coverage", icon: MapPin },
];

const userGroups = [
  {
    icon: GraduationCap, title: "MSMEs",
    desc: "Access structured business development services matched to your needs, with quality-assured delivery.",
    cta: "Get Support"
  },
  {
    icon: Users, title: "BDSPs",
    desc: "Join a performance-driven marketplace. Receive matched demands, deliver services, and get paid on verification.",
    cta: "Become a Provider"
  },
  {
    icon: Building2, title: "Institutions",
    desc: "Commission, monitor, and verify service delivery at scale with full audit trails and compliance reporting.",
    cta: "Request Demo"
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const enterPlatform = () => navigate("/login");

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-secondary-foreground font-heading font-extrabold text-sm">IM</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground">IMARA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#process" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#value" className="hover:text-foreground transition-colors">Features</a>
            <a href="#metrics" className="hover:text-foreground transition-colors">Impact</a>
            <a href="#users" className="hover:text-foreground transition-colors">For You</a>
          </div>
          <Button onClick={enterPlatform} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-sm">
            Log In <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-5xl mx-auto text-center py-28 md:py-36 px-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-secondary font-heading font-bold text-sm tracking-widest uppercase mb-4">
            IMARA BD Marketplace v2.0
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading font-extrabold text-4xl md:text-6xl text-primary-foreground leading-tight">
            How IMARA Works
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-5 text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
            From demand → delivery → impact → payment → a closed-loop system for accountable business development services.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={enterPlatform} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-8 py-6 rounded-xl shadow-lg">
              Log In <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 font-semibold text-base px-8 py-6 rounded-xl"
              asChild
            >
              <a href="#process">See How It Works</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Process Flow */}
      <section id="process" className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-secondary font-heading font-bold text-sm tracking-widest uppercase mb-2">The Execution Loop</p>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground">End-to-End in Five Steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((step, i) => (
              <motion.div key={step.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
                <Card className="h-full border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="relative mx-auto mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-secondary/15 transition-colors">
                        <step.icon className="h-7 w-7 text-primary group-hover:text-secondary transition-colors" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Section */}
      <section id="value" className="py-24 px-6 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-secondary font-heading font-bold text-sm tracking-widest uppercase mb-2">Core Capabilities</p>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground">Built for Scale, Trust and Performance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueCards.map((card, i) => (
              <motion.div key={card.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
                <Card className="h-full border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <card.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground mb-3">{card.title}</h3>
                    <ul className="space-y-2">
                      {card.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-secondary mt-0.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section id="metrics" className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-secondary font-heading font-bold text-sm tracking-widest uppercase mb-2">Impact at Scale</p>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl">Delivering Measurable Results</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((m, i) => (
              <motion.div key={m.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <m.icon className="h-7 w-7 text-secondary" />
                </div>
                <p className="font-heading font-extrabold text-3xl md:text-4xl mb-1">{m.value}</p>
                <p className="text-primary-foreground/70 text-sm font-medium">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Groups */}
      <section id="users" className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-secondary font-heading font-bold text-sm tracking-widest uppercase mb-2">Who It's For</p>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground">Built for Every Actor in the Ecosystem</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userGroups.map((group, i) => (
              <motion.div key={group.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
                <Card className="h-full border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                      <group.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">{group.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{group.desc}</p>
                    <Button onClick={enterPlatform} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-sm rounded-lg">
                      {group.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-muted/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2302404F' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-secondary font-heading font-bold text-sm tracking-widest uppercase mb-2">Trusted Infrastructure</p>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-6">Built on Trust and Standards</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            IMARA provides an institutional-grade execution platform with complete audit trails, compliance verification, and performance-based disbursement designed for governments, development partners, and impact-driven organizations.
          </p>
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="h-8 bg-primary flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
              <span className="text-primary-foreground/60 text-[10px] ml-3 font-mono">IMARA BD Marketplace Dashboard</span>
            </div>
            <div className="p-8 bg-gradient-to-br from-card to-muted/30">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Active Demands", val: "142" },
                  { label: "Assigned BDSPs", val: "87" },
                  { label: "QA Pending", val: "23" },
                  { label: "Payments Ready", val: "64" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-background border border-border p-4 text-center">
                    <p className="text-2xl font-heading font-extrabold text-foreground">{s.val}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {["CREATED", "VALIDATED", "ASSIGNED", "DELIVERED", "VERIFIED", "PAID"].map((s, i) => (
                  <div key={s} className="flex-1 h-2.5 rounded-full" style={{ backgroundColor: i < 4 ? "hsl(var(--secondary))" : "hsl(var(--muted))" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-secondary-foreground font-heading font-extrabold text-sm">IM</span>
            </div>
            <span className="font-heading font-bold text-lg">IMARA BD Marketplace</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">© 2026 IMARA. Institutional-grade execution infrastructure for business development services.</p>
          {/* <Button onClick={enterPlatform} variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-sm">
            Log In <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button> */}
        </div>
      </footer>
    </div>
  );
}
