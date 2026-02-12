import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Sprout, 
  CloudSun, 
  TrendingUp,
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLogout } from "@/hooks/use-auth";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Soil Analysis", icon: Sprout, href: "/dashboard/soil" },
  { label: "Weather", icon: CloudSun, href: "/dashboard/weather" },
  { label: "Market Prices", icon: TrendingUp, href: "/dashboard/market" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { mutate: logout } = useLogout();

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Sprout className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-lg">AgroSoil AI</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full mt-6">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <Button 
              variant="destructive" 
              className="w-full mt-auto"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
