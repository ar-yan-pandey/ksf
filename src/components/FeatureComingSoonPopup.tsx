import React from 'react';
import { Zap } from 'lucide-react';

export function FeatureComingSoonPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="
            absolute top-4 right-4 
            text-gray-500 hover:text-gray-800 
            transition-colors
          "
        >
          ✕
        </button>

        {/* Content */}
        <div className="flex flex-col items-center space-y-6">
          <div className="
            bg-[#17d059]/10 
            text-[#17d059] 
            rounded-full 
            p-4 
            inline-flex 
            items-center 
            justify-center
          ">
            <Zap className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Feature Coming Soon!
            </h2>
            <p className="text-gray-600 mb-6">
              We're working hard to bring you an exciting new way to submit your reports. 
              Stay tuned for updates!
            </p>
          </div>

          <button 
            onClick={onClose}
            className="
              bg-[#17d059] 
              text-white 
              px-6 py-3 
              rounded-full 
              hover:bg-[#17d059]/90 
              transition-colors
            "
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}