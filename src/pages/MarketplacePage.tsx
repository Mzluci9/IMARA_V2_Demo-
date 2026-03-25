import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Award, Filter, User, Briefcase, Star, ArrowRight, Phone, Mail, Eye, X, MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

type RegisteredFilter = "ALL" | "ACTIVE" | "INACTIVE";
type SortOption = "score" | "capacity" | "name";

const SERVICE_OPTIONS = [
  "Digital Literacy",
  "Financial Training",
  "Agricultural Training",
  "Market Access",
  "Vocational Training",
  "Business Planning",
  "Compliance",
];

export default function MarketplacePage() {
  const { bdsps } = useApp();
  const [keyword, setKeyword] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [registeredFilter, setRegisteredFilter] = useState<RegisteredFilter>("ALL");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedBDSP, setSelectedBDSP] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactBDSP, setContactBDSP] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const filtered = bdsps.filter(b => {
    if (keyword && !b.name.toLowerCase().includes(keyword.toLowerCase()) && !b.specializations.some(s => s.toLowerCase().includes(keyword.toLowerCase()))) return false;
    if (locationSearch && !b.location.toLowerCase().includes(locationSearch.toLowerCase())) return false;
    if (registeredFilter === "ACTIVE" && b.status !== "ACTIVE") return false;
    if (registeredFilter === "INACTIVE" && b.status !== "INACTIVE") return false;
    if (selectedServices.length > 0 && !selectedServices.some(s => b.specializations.includes(s))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "capacity") return b.capacity - a.capacity;
    return a.name.localeCompare(b.name);
  });

  const clearFilters = () => {
    setRegisteredFilter("ALL");
    setSelectedServices([]);
    setKeyword("");
    setLocationSearch("");
  };

  const handleSearch = () => {
    toast.success(`Found ${filtered.length} providers`, {
      description: keyword || locationSearch ? `Matching "${keyword}" in "${locationSearch || 'all locations'}"` : "Showing all providers"
    });
  };

  const handlePartnerClick = () => {
    toast.success("Partnership Request Sent!", {
      description: "Our team will reach out to discuss partnership opportunities within 24 hours."
    });
  };

  const handleContact = (bdspId: string) => {
    setContactBDSP(bdspId);
    setShowContactDialog(true);
  };

  const handleSendMessage = () => {
    const bdsp = bdsps.find(b => b.id === contactBDSP);
    setShowContactDialog(false);
    setContactBDSP(null);
    toast.success(`Message sent to ${bdsp?.name}`, {
      description: "They will respond within 1-2 business days."
    });
  };

  const selectedBDSPData = bdsps.find(b => b.id === selectedBDSP);

  return (
    <div className="space-y-0 -m-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(195,50%,12%)] px-6 py-14 text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-5 right-[15%] w-40 h-40 rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-primary-foreground/80 text-xs font-medium px-4 py-1.5 rounded-full mb-5"
          >
            <Award className="h-3.5 w-3.5" />
            Discover Expert Service Providers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3"
          >
            Business Development Service Provider Directory
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-heading text-lg md:text-xl font-semibold text-secondary italic mb-2"
          >
            Expand Your Reach & Impact
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary-foreground/70 text-sm mb-6 max-w-xl mx-auto"
          >
            Connect with MSMEs seeking expert business training, mentoring, and support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <Button
              onClick={handlePartnerClick}
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-white/10 rounded-full px-6"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Partner with IMARA Today!
            </Button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch bg-card rounded-xl shadow-lg max-w-2xl mx-auto overflow-hidden"
          >
            <div className="flex items-center flex-1 px-4 py-3 gap-2 border-b sm:border-b-0 sm:border-r border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search by keyword..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="flex items-center flex-1 px-4 py-3 gap-2 border-b sm:border-b-0 sm:border-r border-border">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Location..."
                value={locationSearch}
                onChange={e => setLocationSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </motion.div>
        </div>
      </div>

      {/* Results Count + Sort */}
      <div className="px-6 pt-5 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-bold text-foreground">{filtered.length}</span> providers
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-1.5 text-xs text-primary font-medium"
          >
            <Filter className="h-3.5 w-3.5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="bg-card border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="score">Highest Rated</option>
              <option value="capacity">Most Available</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Grid */}
      <div className="px-6 pb-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className={`lg:w-72 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          <div className="bg-card rounded-xl border shadow-sm p-5 sticky top-4 space-y-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-bold text-foreground text-base">Filter BDSPs</h3>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <h4 className="font-heading font-semibold text-sm text-foreground">Status</h4>
              </div>
              <div className="space-y-2">
                {(["ALL", "ACTIVE", "INACTIVE"] as RegisteredFilter[]).map(val => (
                  <label key={val} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setRegisteredFilter(val)}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      registeredFilter === val ? "border-primary bg-primary" : "border-muted-foreground/40 group-hover:border-primary/60"
                    }`}>
                      {registeredFilter === val && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className="text-sm text-foreground/80">{val === "ALL" ? "All Providers" : val}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <h4 className="font-heading font-semibold text-sm text-foreground">Services</h4>
              </div>
              <div className="space-y-2">
                {SERVICE_OPTIONS.map(service => (
                  <label key={service} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => toggleService(service)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      selectedServices.includes(service)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40 group-hover:border-primary/60"
                    }`}>
                      {selectedServices.includes(service) && (
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-foreground/80">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={clearFilters} variant="outline" className="w-full text-sm">
              Clear Filters
            </Button>

            {selectedServices.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Active Filters:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedServices.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {s}
                      <X className="h-2.5 w-2.5 cursor-pointer hover:text-destructive" onClick={() => toggleService(s)} />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.aside>

        {/* Cards Grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden group"
              >
                {/* Card Image / Avatar Area */}
                <div className="relative h-36 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary/40" />
                  </div>
                  {b.topPerformer && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow-sm">
                        <Award className="h-3 w-3" /> Top Performer
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className={`h-3 w-3 ${si < Math.floor(b.score) ? "text-secondary fill-secondary" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-semibold text-foreground/60 bg-card/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {b.score}/5.0
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">{b.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {b.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{b.capacity}</span>/{b.maxCapacity} slots available
                    </div>
                    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      b.status === "ACTIVE"
                        ? "bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(b.capacity / b.maxCapacity) * 100}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {b.specializations.slice(0, 2).map(s => (
                      <span key={s} className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full border border-primary/10">{s}</span>
                    ))}
                    {b.specializations.length > 2 && (
                      <span className="text-[10px] text-muted-foreground px-1">+{b.specializations.length - 2}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs h-8"
                      onClick={() => setSelectedBDSP(b.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" /> View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={() => handleContact(b.id)}
                      disabled={b.status === "INACTIVE"}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" /> Contact
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedCard === b.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t px-4 py-3 bg-muted/30 space-y-2"
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Score:</span>
                        <span className="text-xs font-bold text-foreground">{b.score}/5</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">All Specializations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {b.specializations.map(s => (
                            <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-heading font-semibold">No providers found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>

      {/* BDSP Profile Dialog */}
      <Dialog open={!!selectedBDSP} onOpenChange={() => setSelectedBDSP(null)}>
        <DialogContent className="max-w-lg">
          {selectedBDSPData && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading flex items-center gap-2">
                  {selectedBDSPData.name}
                  {selectedBDSPData.topPerformer && (
                    <Badge variant="secondary" className="text-[10px]">
                      <Award className="h-3 w-3 mr-1" /> Top Performer
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>Detailed provider profile</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary/40" />
                  </div>
                  <div>
                    <p className="text-sm flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {selectedBDSPData.location}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className={`h-4 w-4 ${si < Math.floor(selectedBDSPData.score) ? "text-secondary fill-secondary" : "text-muted-foreground/30"}`} />
                      ))}
                      <span className="text-sm font-bold ml-1">{selectedBDSPData.score}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/40 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                    <p className={`text-sm font-bold ${selectedBDSPData.status === "ACTIVE" ? "text-[hsl(var(--success))]" : "text-muted-foreground"}`}>
                      {selectedBDSPData.status}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Capacity</p>
                    <p className="text-sm font-bold text-foreground">{selectedBDSPData.capacity}/{selectedBDSPData.maxCapacity} slots</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBDSPData.specializations.map(s => (
                      <span key={s} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={() => { handleContact(selectedBDSPData.id); setSelectedBDSP(null); }} disabled={selectedBDSPData.status === "INACTIVE"}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedBDSP(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Contact {bdsps.find(b => b.id === contactBDSP)?.name}</DialogTitle>
            <DialogDescription>Send a message to this service provider</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Subject</label>
              <input
                type="text"
                placeholder="Partnership inquiry..."
                className="w-full bg-muted/40 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Message</label>
              <textarea
                placeholder="Describe your requirements..."
                rows={4}
                className="w-full bg-muted/40 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSendMessage}>
                <Mail className="h-4 w-4 mr-2" /> Send Message
              </Button>
              <Button variant="outline" onClick={() => setShowContactDialog(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
