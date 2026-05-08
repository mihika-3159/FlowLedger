'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Save,
  User,
  Bell,
  Database
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const [rate, setRate] = React.useState(state.settings.avgHourlyRate.toString());
  const [hours, setHours] = React.useState(state.settings.workHoursPerYear.toString());

  const handleSave = () => {
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { 
        avgHourlyRate: parseFloat(rate) || 55,
        workHoursPerYear: parseInt(hours) || 2080
      } 
    });
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-sm text-white/40">Configure global parameters for cost analysis and ROI calculations.</p>
      </div>

      <div className="grid gap-8">
        <Card className="glass-card border-white/[0.06] bg-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-indigo-400" />
              <CardTitle>Economic Parameters</CardTitle>
            </div>
            <CardDescription>Default values used for all waste calculations across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rate">Average Blended Hourly Rate (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input 
                    id="rate" 
                    type="number" 
                    value={rate} 
                    onChange={(e) => setRate(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10" 
                  />
                </div>
                <p className="text-[10px] text-white/20 italic">Used to estimate cost of manual effort and potential savings.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Work Hours per Year</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input 
                    id="hours" 
                    type="number" 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10" 
                  />
                </div>
                <p className="text-[10px] text-white/20 italic">Standard corporate year is usually 2080 hours (40h/week).</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-indigo-500 hover:bg-indigo-600 gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/[0.06] bg-transparent opacity-50 cursor-not-allowed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              <CardTitle>Integrations & Auth</CardTitle>
            </div>
            <CardDescription>Connect FlowLedger to your existing toolstack (Zapier, Slack, Jira).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#000] flex items-center justify-center font-bold text-xs">Z</div>
                <div>
                  <p className="text-xs font-bold text-white">Zapier</p>
                  <p className="text-[10px] text-white/30">Auto-detect triggers from 5000+ apps</p>
                </div>
              </div>
              <Badge variant="outline" className="border-white/10 text-white/20">ENTERPRISE ONLY</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#0088cc] flex items-center justify-center font-bold text-xs text-white">S</div>
                <div>
                  <p className="text-xs font-bold text-white">Slack</p>
                  <p className="text-[10px] text-white/30">Map workflows directly from channels</p>
                </div>
              </div>
              <Badge variant="outline" className="border-white/10 text-white/20">ENTERPRISE ONLY</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Data Retention</h3>
              <p className="text-[10px] text-white/30">All data is currently stored locally in your browser's LocalStorage.</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-9 px-4 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
            onClick={() => {
              if (confirm("Delete all workflows and analysis data? This cannot be undone.")) {
                dispatch({ type: 'CLEAR_DATA' });
              }
            }}
          >
            Purge All Data
          </Button>
        </div>
      </div>
    </div>
  );
}
