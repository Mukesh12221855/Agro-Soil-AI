import { useUser } from "@/hooks/use-auth";
import { useSoilReports } from "@/hooks/use-soil";
import { useWeather } from "@/hooks/use-weather";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, CloudSun, TrendingUp, Droplets, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for charts if API is empty
const mockMarketData = [
  { date: 'Mon', price: 2400 },
  { date: 'Tue', price: 1398 },
  { date: 'Wed', price: 9800 },
  { date: 'Thu', price: 3908 },
  { date: 'Fri', price: 4800 },
  { date: 'Sat', price: 3800 },
  { date: 'Sun', price: 4300 },
];

export default function DashboardOverview() {
  const { user } = useUser();
  const { data: soilReports, isLoading: isSoilLoading } = useSoilReports();
  const { data: weather, isLoading: isWeatherLoading } = useWeather(user?.location || "Delhi");

  const latestReport = soilReports?.[0];

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${colorClass.replace("bg-", "text-")}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {subtext}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Welcome back, ${user?.fullName?.split(" ")[0] || "Farmer"} 👋`}
        description="Here's what's happening on your farm today."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard 
            title="Latest Crop"
            value={isSoilLoading ? <Skeleton className="h-8 w-24"/> : (latestReport?.cropRecommendation || "No Data")}
            subtext="Recommended based on soil"
            icon={Sprout}
            colorClass="bg-green-500"
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard 
            title="Current Weather"
            value={isWeatherLoading ? <Skeleton className="h-8 w-16"/> : `${Math.round(weather?.temp || 0)}°C`}
            subtext={weather?.description || "Clear Sky"}
            icon={CloudSun}
            colorClass="bg-blue-500"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard 
            title="Soil Moisture"
            value="Adequate"
            subtext="Last updated 2h ago"
            icon={Droplets}
            colorClass="bg-cyan-500"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard 
            title="Market Trend"
            value="+2.4%"
            subtext="Wheat prices up this week"
            icon={TrendingUp}
            colorClass="bg-orange-500"
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Market Trend Chart */}
        <Card className="col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Market Price Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMarketData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Weather Card */}
        <Card className="col-span-3 border-border/50 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CloudSun className="w-5 h-5" />
              7-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isWeatherLoading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full bg-white/20" />)}
               </div>
            ) : (
              <div className="space-y-4">
                 {weather?.forecast?.slice(0, 4).map((day: any, i: number) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                     <span className="font-medium">{day.date}</span>
                     <div className="flex items-center gap-3">
                       <span className="text-sm opacity-80">{day.condition}</span>
                       <span className="font-bold">{day.temp}°C</span>
                     </div>
                   </div>
                 ))}
                 {!weather && <div className="text-white/80">Weather data unavailable for {user?.location}</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
