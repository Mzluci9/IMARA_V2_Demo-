import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        toast.success("Login successful!");
        navigate(from, { replace: true });
      } else {
        toast.error("Invalid credentials. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  const useDemoAccount = () => {
    setEmail("imarauser@platform.com");
    setPassword("password123");
    toast.info("Demo credentials filled!");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-heading font-extrabold text-xl">IM</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-foreground leading-none">IMARA</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-1">BD Marketplace</span>
            </div>
          </div>
        </div>

        <Card className="border-border/60 shadow-2xl bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-heading font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-secondary hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    Log In
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="relative w-full text-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50"></span>
                </div>
                <span className="relative bg-transparent px-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Or use demo
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={useDemoAccount}
                className="w-full border-secondary/30 text-secondary hover:bg-secondary/10 py-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-5 w-5" />
                Use Demo Account
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium border border-border/40 rounded-lg p-2 bg-muted/20">
            <ShieldCheck className="h-3 w-3 text-secondary" />
            <span>Secure Authentication</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium border border-border/40 rounded-lg p-2 bg-muted/20">
            <Cpu className="h-3 w-3 text-secondary" />
            <span>AI-Powered Marketplace</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
