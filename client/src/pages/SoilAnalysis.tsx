import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { insertSoilReportSchema } from "@shared/schema";
import { api } from "@shared/routes";
import { useCreateSoilReport, usePredictCrop, useSoilReports } from "@/hooks/use-soil";
import { PageHeader } from "@/components/PageHeader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sprout, TestTube, Leaf, ArrowRight } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = insertSoilReportSchema.extend({
  nitrogen: z.coerce.number().min(0).max(140),
  phosphorus: z.coerce.number().min(0).max(145),
  potassium: z.coerce.number().min(0).max(205),
  ph: z.coerce.number().min(0).max(14),
  rainfall: z.coerce.number().min(0),
  temperature: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SoilAnalysis() {
  const [prediction, setPrediction] = useState<{ crop: string; confidence: number; fertilizer: string } | null>(null);
  
  const { mutateAsync: predict, isPending: isPredicting } = usePredictCrop();
  const { mutateAsync: saveReport, isPending: isSaving } = useCreateSoilReport();
  const { data: history } = useSoilReports();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      ph: 7,
      rainfall: 0,
      temperature: 25,
      notes: ""
    }
  });

  async function onSubmit(data: FormValues) {
    try {
      // 1. Get Prediction
      const result = await predict({
        nitrogen: data.nitrogen!,
        phosphorus: data.phosphorus!,
        potassium: data.potassium!,
        ph: data.ph!,
        rainfall: data.rainfall!,
        temperature: data.temperature!
      });

      setPrediction({
        crop: result.recommendedCrop,
        confidence: result.confidence,
        fertilizer: result.fertilizer
      });

      // 2. Save Report automatically
      await saveReport({
        ...data,
        cropRecommendation: result.recommendedCrop,
        fertilizerRecommendation: result.fertilizer,
      });

    } catch (error) {
      console.error("Analysis failed", error);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Soil Analysis" 
        description="Enter soil parameters to get AI-powered crop recommendations."
      />

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Form */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-primary" />
              New Soil Test
            </CardTitle>
            <CardDescription>
              Input values from your soil health card or testing kit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="nitrogen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nitrogen (N)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-muted/30" />
                        </FormControl>
                        <FormDescription className="text-xs">Ratio in soil</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phosphorus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phosphorus (P)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-muted/30" />
                        </FormControl>
                         <FormDescription className="text-xs">Ratio in soil</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="potassium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potassium (K)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-muted/30" />
                        </FormControl>
                         <FormDescription className="text-xs">Ratio in soil</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="ph"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>pH Level</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rainfall"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rainfall (mm)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg" disabled={isPredicting || isSaving} className="bg-primary hover:bg-primary/90 text-white min-w-[200px]">
                    {(isPredicting || isSaving) ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                    ) : (
                      <>Analyze Soil <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {prediction ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-primary/20 bg-primary/5 shadow-md overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary w-full" />
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Sprout className="w-6 h-6" />
                      Recommended Crop
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-6 bg-background rounded-xl border border-primary/10 shadow-sm">
                      <h3 className="text-4xl font-display font-bold text-foreground capitalize">
                        {prediction.crop}
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        Confidence: {Math.round(prediction.confidence * 100)}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        Fertilizer Advice
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {prediction.fertilizer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-muted/20 border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <TestTube className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Run an analysis to see AI crop recommendations here.</p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>

          {/* History Snippet */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {history?.slice(0, 3).map((report, i) => (
                <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium capitalize">{report.cropRecommendation}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {new Date(report.createdAt!).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {!history?.length && <p className="text-sm text-muted-foreground">No previous reports.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
