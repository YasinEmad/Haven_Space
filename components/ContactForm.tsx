'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: formData.email || undefined,
          notes: formData.message,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        console.error('Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Inquiry Sent!</h3>
        <p className="text-white/70">Thank you for your message. We'll get back to you soon.</p>
        <Button
          onClick={() => setIsSubmitted(false)}
          className="mt-4 bg-white text-black hover:bg-white/90"
        >
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">First Name</label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            className="bg-white/5 border-white/10 h-12 focus-visible:ring-emerald-500/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Last Name</label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className="bg-white/5 border-white/10 h-12 focus-visible:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Email Address (Optional)</label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className="bg-white/5 border-white/10 h-12 focus-visible:ring-emerald-500/20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Your Message</label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about the property you are interested in..."
          required
          className="bg-white/5 border-white/10 min-h-[120px] focus-visible:ring-emerald-500/20"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-white text-black hover:bg-white/90 font-bold text-md rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}