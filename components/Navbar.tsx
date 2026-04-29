'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronRight,
  Phone
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // always initialize state/hooks before any conditional return
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll effect for glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // hide navbar on admin pages (including dashboard and login)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/connect' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-[#1a1614]/80 backdrop-blur-lg border-white/10 py-3 shadow-2xl' 
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-white p-1.5 rounded-lg transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Building2 className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase italic">
            Haven<span className="text-white/50 not-italic font-light">Space</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-all duration-200 hover:text-white ${
                isActive(link.href) ? 'text-white' : 'text-white/50'
              } relative`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          ))}
        </div>

        {/* Actions / Auth */}
        <div className="hidden md:flex items-center gap-4">
       

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-full h-10 w-10 p-0 overflow-hidden">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#231e1b] border-white/10 text-white shadow-2xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-white/40">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/admin/login">
              <Button className="bg-white text-black hover:bg-white/90 font-bold px-6 rounded-full transition-transform active:scale-95 shadow-lg shadow-white/5">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-[#1a1614] z-[99] p-6 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-bold flex items-center justify-between ${
                  isActive(link.href) ? 'text-white' : 'text-white/40'
                }`}
              >
                {link.name}
                <ChevronRight className={`w-5 h-5 ${isActive(link.href) ? 'opacity-100' : 'opacity-0'}`} />
              </Link>
            ))}
            
            <hr className="border-white/10 my-2" />
            
            {session ? (
              <>
                <Link 
                  href="/admin/dashboard" 
                  className="text-white/60 flex items-center gap-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-red-400 flex items-center gap-3 py-2 text-left"
                >
                  <LogOut className="w-5 h-5" /> Log Out
                </button>
              </>
            ) : (
              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-white text-black h-14 rounded-2xl font-bold text-lg">
                  Sign In to Portal
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}