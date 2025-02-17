import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Send } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeStatus('error');
      return;
    }

    setSubscribeStatus('loading');

    try {
      // Insert email into newsletter_subscribers table
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ 
          email, 
          subscribed_at: new Date().toISOString(),
          source: 'website'
        });

      if (error) {
        // Handle specific error cases
        if (error.code === '23505') {
          // Unique constraint violation (duplicate email)
          setSubscribeStatus('error');
          return;
        }
        throw error;
      }

      setSubscribeStatus('success');
      setEmail(''); // Clear input
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('error');
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-2xl font-bold mb-4">About KSF</h3>
          <p className="text-gray-300 mb-4">
            KIIT Student Forum (KSF) is an independent, student-run platform 
            dedicated to sharing news, stories, and perspectives from the KIIT community.
          </p>
          <p className="text-sm text-gray-400 italic">
            Disclaimer: This is an independent student forum and is not officially 
            associated with or endorsed by KIIT University.
          </p>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <form onSubmit={handleSubscribe} className="flex">
            <div className="relative flex-grow">
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full 
                  px-4 py-3 
                  bg-gray-800 
                  text-white 
                  rounded-l-lg 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-[#17d059]
                "
                required
              />
              {subscribeStatus === 'success' && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
                  ✓
                </div>
              )}
            </div>
            <button 
              type="submit" 
              disabled={subscribeStatus === 'loading'}
              className="
                bg-[#17d059] 
                text-white 
                px-4 py-3 
                rounded-r-lg 
                hover:bg-[#17d059]/90 
                transition-colors
                flex items-center
                disabled:opacity-50
              "
            >
              {subscribeStatus === 'loading' ? (
                <span className="animate-pulse">Subscribing...</span>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          {subscribeStatus === 'error' && (
            <p className="text-red-500 mt-2 text-sm">
              Invalid email or subscription failed. Please try again.
            </p>
          )}
          {subscribeStatus === 'success' && (
            <p className="text-green-500 mt-2 text-sm">
              Successfully subscribed to our newsletter!
            </p>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 mt-8 pt-4 border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} KIIT Student Forum. All rights reserved.</p>
      </div>
    </footer>
  );
}