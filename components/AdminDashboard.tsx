'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyManagement from './admin/PropertyManagement';
import LeadsTable from './admin/LeadsTable';
import { 
  LogOut, 
  LayoutDashboard, 
  Home, 
  Plus, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ExternalLink,
  Loader2,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

function StatsCard({
  title,
  value,
  icon,
  color,
  loading
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'cyan' | 'emerald' | 'amber' | 'rose';
  loading: boolean;
}) {
  const map: Record<typeof color, { accent: string; bg: string; border: string }> = {
    cyan: { accent: 'text-cyan-400', bg: 'bg-cyan-500/5', border: 'border-cyan-500/20' },
    emerald: { accent: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
    amber: { accent: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
    rose: { accent: 'text-rose-400', bg: 'bg-rose-500/5', border: 'border-rose-500/20' },
  };

  const { accent, bg, border } = map[color];

  return (
    <Card className={`${bg} ${border} border backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${bg} ${accent}`}>
            {icon}
          </div>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-white/20" />}
        </div>
        <div>
          <p className="text-sm font-medium text-white/50 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">
            {loading ? '...' : value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    pendingProperties: 0,
  });
  const [leadCount, setLeadCount] = useState(0);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentCount, setPaymentCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchLeads();
    fetchPayments();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties');
      const properties = await res.json();

      setStats({
        totalProperties: properties.length,
        availableProperties: properties.filter((p: any) => p.status === 'available').length,
        soldProperties: properties.filter((p: any) => p.status === 'sold').length,
        pendingProperties: properties.filter((p: any) => p.status === 'pending').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        setLeadCount(data.length);
      } else {
        console.error('Failed to load leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchPayments = async () => {
    setPaymentsLoading(true);
    try {
      const res = await fetch('/api/payment');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.transactions || []);
        setPaymentCount(data.count || 0);
        setTotalRevenue(
          (data.transactions || []).reduce(
            (sum: number, payment: any) => sum + Number(payment.amount),
            0
          )
        );
      } else {
        console.error('Failed to load payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleDeleteLeadConfirm = async () => {
    if (!leadToDelete) return;

    try {
      const res = await fetch(`/api/leads/${leadToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        fetchLeads();
      } else {
        alert('Failed to delete lead');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting lead');
    } finally {
      setLeadToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1614] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#231e1b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-2 rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">Real Estate Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Link href="/" target="_blank">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Site
                </Button>
             </Link>
            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">{session?.user?.name || 'Admin User'}</p>
              <p className="text-xs text-white/40 mt-1">{session?.user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/5 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<Home className="w-5 h-5" />}
            color="cyan"
            loading={loading}
          />
          <StatsCard
            title="Leads"
            value={leadCount}
            icon={<MessageSquare className="w-5 h-5" />}
            color="emerald"
            loading={leadsLoading}
          />
          <StatsCard
            title="Payments"
            value={paymentCount}
            icon={<CreditCard className="w-5 h-5" />}
            color="cyan"
            loading={paymentsLoading}
          />
          <StatsCard
            title="Revenue"
            value={totalRevenue}
            icon={<TrendingUp className="w-5 h-5" />}
            color="rose"
            loading={paymentsLoading}
          />
          <StatsCard
            title="Available"
            value={stats.availableProperties}
            icon={<CheckCircle className="w-5 h-5" />}
            color="emerald"
            loading={loading}
          />
          <StatsCard
            title="Pending"
            value={stats.pendingProperties}
            icon={<Clock className="w-5 h-5" />}
            color="amber"
            loading={loading}
          />
          <StatsCard
            title="Sold"
            value={stats.soldProperties}
            icon={<TrendingUp className="w-5 h-5" />}
            color="rose"
            loading={loading}
          />
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              <TabsTrigger 
                value="properties" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white rounded-none pb-4 px-0 text-white/50 hover:text-white/80 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                All Properties
              </TabsTrigger>
              <TabsTrigger 
                value="leads" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white rounded-none pb-4 px-0 text-white/50 hover:text-white/80 transition-all"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Leads
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white rounded-none pb-4 px-0 text-white/50 hover:text-white/80 transition-all"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payments
              </TabsTrigger>
            
            </TabsList>
          </div>

          <TabsContent value="properties" className="mt-0 outline-none">
            <PropertyManagement onPropertyChange={fetchStats} />
          </TabsContent>

          <TabsContent value="new" className="mt-0 outline-none">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Listing Creator</h2>
                <p className="text-white/50">Complete the details below to list a new property on the market.</p>
              </div>
              <PropertyManagement isAddingNew onPropertyChange={fetchStats} />
            </div>
          </TabsContent>

          <TabsContent value="leads" className="mt-0 outline-none">
            <div className="max-w-5xl mx-auto">
              {leadsLoading ? (
                <div className="text-center py-8 text-white/70">
                  Loading leads...
                </div>
              ) : (
                <LeadsTable
                leads={leads}
                onDelete={(id: string) => {
                  setLeadToDelete(id);
                }}
              />
              )}

              <ConfirmDialog
                open={Boolean(leadToDelete)}
                onOpenChange={(open) => {
                  if (!open) setLeadToDelete(null);
                }}
                title="Delete lead?"
                description="This action is permanent. Are you sure you want to delete this lead?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteLeadConfirm}
              />
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-0 outline-none">
            <div className="max-w-6xl mx-auto">
              {paymentsLoading ? (
                <div className="text-center py-8 text-white/70">
                  Loading payment records...
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-white/70">
                  No payment data available yet.
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                  <div className="grid grid-cols-6 gap-4 bg-white/5 px-6 py-4 text-xs uppercase tracking-[0.2em] text-white/60">
                    <div className="col-span-2">Property</div>
                    <div>Amount</div>
                    <div>Type</div>
                    <div>Payer</div>
                    <div>Date</div>
                  </div>
                  <div className="divide-y divide-white/10">
                    {payments.map((payment) => (
                      <div key={payment.transactionId} className="grid grid-cols-6 gap-4 px-6 py-4 text-sm text-white/80">
                        <div className="col-span-2">
                          {payment.propertyName || '—'}
                        </div>
                        <div>
                          {payment.amount} {payment.currency}
                        </div>
                        <div>
                          {payment.paymentType === 'installment' ? 'Installment' : 'Full'}
                        </div>
                        <div>
                          {payment.payerName}
                        </div>
                        <div>
                          {new Date(payment.timestamp).toLocaleDateString('en-US')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}