import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wine, Mail, Lock, ShieldCheck } from "lucide-react";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth";
import { toast } from "sonner";
import WhiskeySpinner from "@/components/WhiskeySpinner";

const VIEW = { AUTH: "auth", VERIFY: "verify" };

export default function LoginPage() {
  const navigate = useNavigate();

  const [view, setView] = useState(VIEW.AUTH);
  const [activeTab, setActiveTab] = useState("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState("");

  // ── Sign In ──────────────────────────────────────────────────
  const handleSignIn = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !password)
        return toast.error("Please fill in all fields", {
          position: "top-center",
        });

      setIsLoading(true);
      try {
        const { isSignedIn } = await signIn({ username: email, password });
        if (isSignedIn) {
          toast.success("Welcome back!", { position: "top-center" });
          navigate("/home");
        }
      } catch (error) {
        if (error.name === "UserAlreadyAuthenticatedException") {
          navigate("/home");
        } else {
          toast.error(error.message || "Login failed", {
            position: "top-center",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, navigate],
  );

  // ── Sign Up ──────────────────────────────────────────────────
  const handleSignUp = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !password)
        return toast.error("Please fill in all fields", {
          position: "top-center",
        });

      setIsLoading(true);
      try {
        const { nextStep } = await signUp({
          username: email,
          password,
          options: { userAttributes: { email }, autoSignIn: true },
        });
        if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          toast.success("Verification code sent to your email!", {
            position: "top-center",
          });
          setView(VIEW.VERIFY);
        }
      } catch (error) {
        toast.error(error.message || "Failed to sign up", {
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [email, password],
  );

  // ── Confirm Sign Up + auto sign-in ──────────────────────────
  const handleConfirmSignUp = useCallback(
    async (e) => {
      e.preventDefault();
      if (!authCode)
        return toast.error("Please enter the verification code", {
          position: "top-center",
        });

      setIsLoading(true);
      try {
        await confirmSignUp({ username: email, confirmationCode: authCode });
        toast.success("Account verified!", { position: "top-center" });

        const { isSignedIn } = await signIn({ username: email, password });
        if (isSignedIn) {
          toast.success("Welcome to Rabbit Liquor!", {
            position: "top-center",
          });
          navigate("/home");
        }
      } catch (error) {
        toast.error(error.message || "Verification failed", {
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, authCode, navigate],
  );

  // ── Shared input styles ──────────────────────────────────────
  const inputClass =
    "h-11 rounded-lg border-gold/25 bg-[#2d333a]/[0.04] text-[#3a424b] placeholder:text-[#8a94a0] focus-visible:border-gold/60 focus-visible:ring-gold/15";
  const labelClass =
    "text-[11px] font-semibold tracking-[1.5px] uppercase text-gold/70";

  // ── Verification View ────────────────────────────────────────
  if (view === VIEW.VERIFY) {
    return (
      <Shell isLoading={isLoading}>
        <Card className="w-full border-gold/20 bg-bg-card shadow-2xl shadow-black/50">
          <CardHeader className="items-center text-center pb-2">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08]">
              <ShieldCheck className="size-7 text-gold" />
            </div>
            <CardTitle className="font-serif-app text-xl text-[#2d333a]">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-[13px] text-gold/50">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-gold">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleConfirmSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className={labelClass}>
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={authCode}
                  onChange={(e) =>
                    setAuthCode(e.target.value.replace(/\D/g, ""))
                  }
                  className={`${inputClass} text-center text-2xl tracking-[0.75rem] font-bold h-14`}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full h-11 bg-gradient-to-br from-gold to-gold-dark text-white font-bold tracking-wide uppercase hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(194,90,58,0.3)]"
              >
                Verify & Sign In
              </Button>

              <button
                type="button"
                onClick={() => {
                  setView(VIEW.AUTH);
                  setAuthCode("");
                }}
                className="flex items-center justify-center gap-1.5 w-full text-[13px] text-gold/50 hover:text-gold transition-colors bg-transparent border-none cursor-pointer"
              >
                <ArrowLeft size={14} />
                Back to Sign Up
              </button>
            </form>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  // ── Auth View (Sign In / Sign Up tabs) ───────────────────────
  return (
    <Shell isLoading={isLoading}>
      <Card className="w-full border-gold/20 bg-bg-card shadow-2xl shadow-black/50">
        <CardHeader className="items-center text-center pb-2">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08]">
            <Wine className="size-7 text-gold" />
          </div>
          <p className="text-[10px] tracking-[4px] uppercase text-gold/80">
            Premium Spirits
          </p>
          <CardTitle className="font-serif-app text-xl text-[#2d333a]">
            Welcome to <em className="text-gold italic">Rabbit Liquor</em>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-5 bg-[#2d333a]/[0.05]">
              <TabsTrigger
                value="signin"
                className="font-semibold text-[#6b7681] data-active:!bg-gold data-active:!text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="font-semibold text-[#6b7681] data-active:!bg-gold data-active:!text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* ── Sign In ── */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="si-email" className={labelClass}>
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold/40" />
                    <Input
                      id="si-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="si-password" className={labelClass}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold/40" />
                    <Input
                      id="si-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-11 mt-1 bg-gradient-to-br from-gold to-gold-dark text-white font-bold tracking-wide uppercase hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(194,90,58,0.3)]"
                >
                  Sign In
                </Button>
              </form>

              <p className="mt-5 text-center text-[12.5px] text-[#555]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-gold hover:text-gold-light hover:underline bg-transparent border-none cursor-pointer text-[12.5px]"
                >
                  Create one
                </button>
              </p>
            </TabsContent>

            {/* ── Sign Up ── */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="su-email" className={labelClass}>
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold/40" />
                    <Input
                      id="su-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="su-password" className={labelClass}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold/40" />
                    <Input
                      id="su-password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-11 mt-1 bg-gradient-to-br from-gold to-gold-dark text-white font-bold tracking-wide uppercase hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(194,90,58,0.3)]"
                >
                  Create Account
                </Button>
              </form>

              <p className="mt-5 text-center text-[12.5px] text-[#555]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className="text-gold hover:text-gold-light hover:underline bg-transparent border-none cursor-pointer text-[12.5px]"
                >
                  Sign in
                </button>
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Shell>
  );
}

/** Full-page centered shell with the dark gold ambient background */
function Shell({ children, isLoading }) {
  return (
    <div
      className="min-h-svh w-full flex items-center justify-center bg-bg-base font-sans-app relative overflow-hidden
        before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_60%_55%_at_50%_40%,rgba(201,168,76,0.07)_0%,transparent_70%)] before:pointer-events-none
        after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle,rgba(201,168,76,0.06)_1px,transparent_1px)] after:[background-size:28px_28px] after:pointer-events-none"
    >
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-sm">
          <WhiskeySpinner size={80} label="Please wait…" />
        </div>
      )}
      <div className="relative z-[1] w-full max-w-[420px] mx-6">{children}</div>
    </div>
  );
}
