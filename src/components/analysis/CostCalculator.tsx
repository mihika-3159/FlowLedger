'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Calculator, 
  TrendingDown, 
  ArrowRight, 
  Coins, 
  Users,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  initialHours: number;
  initialAnnualLoss: number;
}

export function CostCalculator({ initialHours, initialAnnualLoss }: Props) {
  const [hourlyRate, setHourlyRate] = React.useState(55);
  const [teamSize, setTeamSize] = React.useState(1);
  const [efficiencyGain, setEfficiencyGain] = React.useState(70);

  const weeklyWastedHours = initialHours * teamSize;
  const annualLoss = weeklyWastedHours * hourlyRate * 52;
  const potentialSavings = annualLoss * (efficiencyGain / 100);

  return (
    <Card className="glass-card border-white/[0.06] bg-transparent">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-indigo-400" />
          ROI Multiplier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-white/40 uppercase tracking-wider">Avg. Hourly Rate (USD)</Label>
              <span className="text-sm font-bold text-white">${hourlyRate}</span>
            </div>
            <Slider 
              value={[hourlyRate]} 
              onValueChange={(v) => setHourlyRate(v[0])} 
              max={250} 
              min={20} 
              step={5}
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-white/40 uppercase tracking-wider">Affected Team Size</Label>
              <span className="text-sm font-bold text-white">{teamSize} {teamSize === 1 ? 'person' : 'people'}</span>
            </div>
            <Slider 
              value={[teamSize]} 
              onValueChange={(v) => setTeamSize(v[0])} 
              max={50} 
              min={1} 
              step={1}
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-white/40 uppercase tracking-wider">Automation Efficiency Gain</Label>
              <span className="text-sm font-bold text-emerald-400">{efficiencyGain}%</span>
            </div>
            <Slider 
              value={[efficiencyGain]} 
              onValueChange={(v) => setEfficiencyGain(v[0])} 
              max={100} 
              min={10} 
              step={5}
              className="py-2"
            />
          </div>
        </div>

        <Separator className="bg-white/[0.06]" />

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Adjusted Annual Waste</p>
                <p className="text-lg font-bold text-white">${annualLoss.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Potential Recoverable Capital</p>
                <p className="text-xl font-bold text-emerald-400">${Math.round(potentialSavings).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-indigo-500 hover:bg-indigo-600 gap-2 h-11">
          <Target className="h-4 w-4" /> Apply to Action Plan
        </Button>
      </CardContent>
    </Card>
  );
}

const Separator = ({ className }: { className?: string }) => <div className={`h-px w-full ${className}`} />;
