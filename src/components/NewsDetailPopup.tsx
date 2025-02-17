import React, { useEffect } from 'react';
import { X, Share2, Clock, ArrowLeft } from 'lucide-react';
import { NewsItem } from '../types/news';

interface NewsDetailPopupProps {
  news: NewsItem;
  onClose: () => void;
}

export const NewsDetailPopup: React.FC<NewsDetailPopupProps> = ({ news, onClose }) => {
  // Handle Escape key to close popup
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Prevent scrolling on the background
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleShare = () => {
    const url = `${window.location.origin}/news/${news.id}`;
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.subtitle || '',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className="
        fixed inset-0 z-50 
        bg-black/50 backdrop-blur-sm 
        flex items-center justify-center 
        p-4 overflow-y-auto 
        animate-fade-in
      "
      onClick={onClose}
    >
      <div 
        className="
          relative 
          bg-white 
          rounded-3xl 
          max-w-4xl 
          w-full 
          max-h-[90vh] 
          overflow-y-auto 
          shadow-2xl
          animate-fade-in-up
          my-auto
          scrollbar-thin
          scrollbar-firefox
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close and Back Button */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
          <button 
            onClick={onClose}
            className="
              bg-white/10 backdrop-blur-md 
              hover:bg-white/20 
              p-2 rounded-full 
              transition-colors
            "
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={handleShare}
            className="
              bg-white/10 backdrop-blur-md 
              hover:bg-white/20 
              p-2 rounded-full 
              transition-colors
            "
          >
            <Share2 className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* News Image */}
        {news.image_url && (
          <div className="
            relative 
            w-full 
            h-64 md:h-[500px] 
            overflow-hidden 
            rounded-t-3xl
          ">
            <img 
              src={news.image_url} 
              alt={news.title}
              className="
                w-full h-full object-cover 
                transition-transform duration-300 
                hover:scale-105
              "
            />
            {/* Gradient Overlay */}
            <div className="
              absolute inset-0 
              bg-gradient-to-b 
              from-transparent 
              via-transparent 
              to-white/90
            "></div>
          </div>
        )}

        {/* News Content */}
        <div className="
          relative 
          p-6 md:p-12 
          -mt-16 md:-mt-24 
          bg-white 
          rounded-3xl 
          z-10
        ">
          {/* Category and Date */}
          <div className="
            flex justify-between 
            items-center 
            text-sm 
            text-gray-500 
            mb-4
          ">
            {news.category && (
              <span className="
                bg-[#17d059]/10 
                text-[#17d059] 
                px-3 py-1 
                rounded-full 
                uppercase 
                tracking-wider 
                text-xs 
                font-semibold
              ">
                {news.category}
              </span>
            )}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <time>
                {new Date(news.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>

          {/* Title */}
          <h2 className="
            text-3xl md:text-4xl 
            font-bold 
            text-gray-900 
            mb-6 
            leading-tight
          ">
            {news.title}
          </h2>

          {/* Subtitle */}
          {news.subtitle && (
            <p className="
              text-xl 
              text-gray-600 
              mb-6 
              italic 
              border-l-4 
              border-[#17d059] 
              pl-4
            ">
              {news.subtitle}
            </p>
          )}

          {/* Full Content */}
          <div className="
            prose 
            max-w-none 
            text-gray-800 
            leading-relaxed 
            space-y-4
          ">
            {news.content}
          </div>
        </div>
      </div>
    </div>
  );
};