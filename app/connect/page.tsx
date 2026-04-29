import type { Metadata } from 'next'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  MessageSquare,
  ArrowRight,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Connect - Real Estate Hub',
  description: 'Reach out to our team and get in touch with agents.',
}

export default function ConnectPage() {
  const socials = [
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: 'https://chatgpt.com/', color: 'hover:text-pink-400' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/company/realestatehub', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: 'https://www.facebook.com/RealEstateHub', color: 'hover:text-blue-600' },
    { name: 'X', icon: <Twitter className="w-5 h-5" />, href: 'https://x.com/RealEstateHub', color: 'hover:text-white' },
  ];

  return (
    <div className="min-h-screen bg-[#1a1614] text-white pt-24 pb-12">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <main className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Summary & Socials */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase">
                Connect<span className="text-white/20 not-italic font-light">WithUs</span>
              </h1>
              
              <div className="space-y-4 max-w-lg">
                <p className="text-white/70 text-lg leading-relaxed">
                  The <span className="text-white font-bold">Real Estate Hub</span> is more than just a listing platform. We are a curated concierge service dedicated to connecting discerning buyers with world-class architecture.
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  Our portfolio represents the pinnacle of residential and commercial design. Whether you are looking to invest, relocate, or list a flagship property, our agents provide the digital infrastructure and professional network to make it happen.
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all">
                  <Mail className="w-5 h-5 text-white/60 group-hover:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email Us</p>
                  <a className="text-white font-medium hover:text-emerald-400" href="mailto:amir220033ashraf@gmail.com">amir220033ashraf@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all">
                  <Phone className="w-5 h-5 text-white/60 group-hover:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Call Us</p>
                  <a className="text-white font-medium hover:text-emerald-400" href="tel:+201064320698">+20 106 432 0698</a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all">
                  <MapPin className="w-5 h-5 text-white/60 group-hover:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Visit Headquaters</p>
                  <a
                    className="text-white font-medium hover:text-emerald-400"
                    href="https://www.google.com/maps/search/New+Cairo+90"
                    target="_blank"
                    rel="noreferrer"
                  >
                    New Cairo 90
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Grid */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Follow Our Portfolio</p>
              <div className="flex gap-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 transition-all ${social.color} hover:bg-white/10`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <Card className="bg-[#231e1b] border-white/10 shadow-2xl overflow-hidden sticky top-24">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-white/10 to-[#231e1b]" />
            <CardContent className="p-8 md:p-12">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-widest">Direct Message</span>
                </div>
                <h2 className="text-2xl font-bold">Send an Inquiry</h2>
              </div>

              <ContactForm />
              
              <div className="mt-8 flex items-center justify-center gap-2 text-white/20">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-widest font-medium">Available Worldwide</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}