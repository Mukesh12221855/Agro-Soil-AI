import { useUser } from "@/hooks/use-auth";
import { useWeather } from "@/hooks/use-weather";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react";
import { motion } from "framer-motion";

export default function Weather() {
  const { user } = useUser();
  const { data: weather, isLoading } = useWeather(user?.location || "Delhi");

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("rain")) return <CloudRain className="w-12 h-12 text-blue-400" />;
    if (c.includes("cloud")) return <Cloud className="w-12 h-12 text-gray-400" />;
    return <Sun className="w-12 h-12 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Weather Forecast" 
        description={`Current conditions and 7-day outlook for ${user?.location || "your area"}.`} 
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        </div>
      ) : (
        <>
          {/* Current Weather Hero */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sun className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2 text-blue-100">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-md">Now</span>
                  <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-display font-bold mb-4 tracking-tighter">
                  {Math.round(weather?.temp || 0)}°
                </h2>
                <p className="text-xl md:text-2xl font-medium opacity-90 capitalize">
                  {weather?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Humidity</p>
                    <p className="text-lg font-bold">{weather?.humidity}%</p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Wind className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Wind</p>
                    <p className="text-lg font-bold">12 km/h</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 7-Day Forecast Grid */}
          <h3 className="text-xl font-bold text-foreground mt-8">7-Day Forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {weather?.forecast?.map((day: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="text-center hover:border-primary/50 transition-colors cursor-default">
                  <CardContent className="pt-6 pb-4 flex flex-col items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">{day.date}</span>
                    {getWeatherIcon(day.condition)}
                    <div className="mt-1">
                      <span className="text-lg font-bold">{day.temp}°</span>
                      <p className="text-xs text-muted-foreground capitalize mt-1">{day.condition}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
