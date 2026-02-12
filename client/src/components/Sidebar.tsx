import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  LogOut, 
  UserCircle 
} from "lucide-react";
import { useLogout, useUser } from "@/hooks/use-auth";
import { Button } from "./ui/button";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Soil Analysis", icon: Sprout, href: "/dashboard/soil" },
  { label: "Weather", icon: CloudSun, href: "/dashboard/weather" },
  { label: "Market Prices", icon: TrendingUp, href: "/dashboard/market" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { mutate: logout } = useLogout();
  const { user } = useUser();

  return (
    <div className="h-screen w-64 bg-card border-r border-border flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            AgroSoil AI
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <UserCircle className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.fullName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role || "Farmer"}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
