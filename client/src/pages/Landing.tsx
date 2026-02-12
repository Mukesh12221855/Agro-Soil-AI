import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sprout, TrendingUp, CloudSun, ArrowRight, ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Farm landscape video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-countryside-meadow-4075-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-tight">AgroSoil AI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Log In</Button>
          </Link>
          <Link href="/auth?tab=register">
            <Button className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Agriculture
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight drop-shadow-sm">
            Predictive Analysis for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
              Sustainable Farming
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Optimize your crop yields with AI-driven soil analysis, real-time weather insights, and market trend predictions. Farming smarter, not harder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth">
              <Button size="lg" className="h-14 px-8 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 transition-all hover:scale-105">
                Start Analysis Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
              View Demo
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Features Stripe */}
      <div className="relative z-20 bg-black/30 backdrop-blur-lg border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Sprout, 
              title: "Soil Intelligence", 
              desc: "Get precise crop recommendations based on NPK values and soil composition." 
            },
            { 
              icon: CloudSun, 
              title: "Weather Forecast", 
              desc: "Plan ahead with 7-day hyper-local weather predictions and alerts." 
            },
            { 
              icon: TrendingUp, 
              title: "Market Trends", 
              desc: "Stay profitable with real-time crop market prices and trend analysis." 
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex gap-4 items-start"
            >
              <div className="p-3 rounded-lg bg-white/10 text-green-400">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
