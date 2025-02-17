import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!, 
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

export const NewsletterPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Insert email into Supabase newsletter_subscribers table
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) {
        // Check if error is due to unique constraint violation
        if (error.code === '23505') {
          setSubmitStatus('success'); // Treat existing email as a successful signup
        } else {
          console.error('Newsletter signup error:', error);
          setSubmitStatus('error');
        }
      } else {
        setSubmitStatus('success');
        setEmail('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Subscribe to Our Newsletter</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Subscribe'}
          </button>
          {submitStatus === 'success' && (
            <p className="text-green-600 text-center">Thank you for subscribing!</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-600 text-center">Failed to subscribe. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
};