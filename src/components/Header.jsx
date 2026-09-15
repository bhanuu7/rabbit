import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Search, User, Clock, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import RabbitLogo from "@/assets/RabbitLogo";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { signOut } from "aws-amplify/auth";
import { toast } from "sonner";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const cartCount = getCartCount();
  const { username } = useContext(UserContext);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully", {
      position: "top-center",
    });
    localStorage.clear();
    navigate("/");
  };

  const navLinkBase =
    "text-[#888] text-[13px] tracking-[1px] uppercase py-1.5 px-[13px] rounded-md transition-all duration-[280ms] bg-transparent border-none cursor-pointer font-sans-app hover:text-gold hover:bg-[rgba(201,168,76,0.07)] whitespace-nowrap";
  const navLinkActive = "text-gold bg-[rgba(201,168,76,0.07)]";

  return (
    <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 h-full max-md:flex max-md:justify-between max-md:gap-2">
      {/* LEFT — Brand + Nav */}
      <div className="flex items-center gap-4 min-w-0 overflow-hidden">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 shrink-0"
        >
          <RabbitLogo size={36} />
          <span className="text-[17px] font-bold text-gold font-serif-app tracking-[0.8px] whitespace-nowrap max-[480px]:text-sm">
            Rabbit Liquor
          </span>
        </button>
        <div className="flex items-center gap-0.5 max-lg:hidden shrink-0">
          <button
            onClick={() => navigate("/home")}
            className={`${navLinkBase} ${pathname === "/home" ? navLinkActive : ""}`}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/products")}
            className={`${navLinkBase} ${pathname === "/products" ? navLinkActive : ""}`}
          >
            Reserve
          </button>
          <button
            onClick={() => navigate("/home?page=story")}
            className={navLinkBase}
          >
            About Us
          </button>
        </div>
      </div>

      {/* CENTER — Search */}
      <div className="flex justify-center max-md:hidden">
        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.22)] rounded-full py-[7px] px-[18px] w-[240px] transition-all duration-[280ms] focus-within:border-gold focus-within:bg-[rgba(255,255,255,0.06)]">
          <Search className="w-[15px] h-[15px] text-gold shrink-0" />
          <input
            type="text"
            placeholder="Search spirits, wines…"
            className="bg-transparent border-none outline-none text-text-main text-[13px] font-sans-app w-full placeholder:text-text-dim"
            aria-label="Search"
          />
        </div>
      </div>

      {/* RIGHT — Cart + Profile */}
      <div className="flex items-center justify-end gap-3">
        {/* Cart */}
        <button
          className="relative bg-transparent border border-[rgba(201,168,76,0.28)] text-gold w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-[280ms] shrink-0 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold"
          aria-label="Cart"
          onClick={() => navigate("/cart")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="18"
            height="18"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-black text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          className="bg-transparent border border-[rgba(201,168,76,0.28)] text-gold w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-[280ms] shrink-0 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold max-[480px]:hidden"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "dark" ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full ring-offset-[#080808] hover:ring-2 hover:ring-[rgba(201,168,76,0.5)] transition-all duration-[280ms] p-0"
            >
              <Avatar className="h-10 w-10 border border-[rgba(201,168,76,0.3)]">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                />
                <AvatarFallback className="bg-[rgba(201,168,76,0.12)] text-gold font-serif-app font-bold text-sm">
                  {username}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 bg-[#111111] border-[rgba(201,168,76,0.22)] text-text-main"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-gold font-serif-app">
                  {username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[rgba(201,168,76,0.12)]" />
            <DropdownMenuItem className="cursor-pointer text-[#999] transition-colors duration-200 focus:bg-[rgba(201,168,76,0.07)] focus:text-gold">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-[#999] transition-colors duration-200 focus:bg-[rgba(201,168,76,0.07)] focus:text-gold"
              onClick={() => navigate("/orders")}
            >
              <Clock className="mr-2 h-4 w-4" />
              Order History
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(201,168,76,0.12)]" />
            <DropdownMenuItem
              className="cursor-pointer text-red-500/80 focus:bg-red-500/10 focus:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
