import { useState } from 'react';
import apiClient from '../api/client';

export default function Upgrade() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Call your backend endpoint
      // Update this URL to match your API base path (e.g., apiClient or direct fetch)
      const response = await apiClient.post('/create-checkout-session')

      const data = response.data;

      // 2. Redirect the browser to Stripe's Hosted Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Stripe URL missing from response');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to initiate checkout. Please try again.');
      setIsLoading(false); // Only stop loading if it fails. If successful, leave it loading during redirect.
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleUpgrade}
        disabled={isLoading}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            {/* Simple SVG loading spinner */}
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Redirecting to Stripe...
          </span>
        ) : (
          'Upgrade to Pro'
        )}
      </button>
      
      {/* Display error message if the API call fails */}
      {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
    </div>
  );
}