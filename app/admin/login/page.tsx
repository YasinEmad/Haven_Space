'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, AlertCircle, Lock, User, Loader2, Info, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else if (result?.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('System error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1614] flex items-center justify-center p-6">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-4xl bg-[#231e1b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side: Branding & Info (Hidden on small mobile if needed, but looks great on tablet+) */}
        <div className="md:w-5/12 bg-white/[0.02] p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-white/5">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Admin Gateway</h1>
            <p className="text-white/50 leading-relaxed">
              Access your real estate portfolio, manage listings, and track property performance.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-2 text-white/30">
              <Info className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">System Credentials</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col">
                <span className="text-[10px] text-white/20 uppercase">Env Variable</span>
                <code className="text-emerald-400/70 text-xs mt-1">ADMIN_USERNAME</code>
              </div>
              <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col">
                <span className="text-[10px] text-white/20 uppercase">Env Variable</span>
                <code className="text-emerald-400/70 text-xs mt-1">ADMIN_PASSWORD</code>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white">Sign In</h2>
            <p className="text-white/40 text-sm mt-1">Enter your management credentials below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 items-center">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-200/80 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                <Input
                  type="text"
                  placeholder="Username"
                  className="bg-white/5 border-white/10 text-white pl-12 h-14 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-white/5 border-white/10 text-white pl-12 h-14 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-white/20 text-[10px] uppercase tracking-[0.2em] font-medium">
            &copy; 2026 Property Management Group
          </p>
        </div>

      </div>
    </div>
  );
}