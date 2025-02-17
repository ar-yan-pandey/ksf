import React, { useState } from 'react';
import { Clock, ArrowRight, Zap } from 'lucide-react';
import { NewsItem } from '../types/news';
import { NewsDetailPopup } from './NewsDetailPopup';

// Utility function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString; // Fallback to original string if formatting fails
  }
};

export function NewsCard({ 
  news, 
  onPopupToggle,
  onNewsClick,
  isTopNews = false,
  className = ''
}: { 
  news: NewsItem, 
  onPopupToggle?: (visible: boolean) => void,
  onNewsClick?: (news: NewsItem) => void,
  isTopNews?: boolean,
  className?: string
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    onNewsClick?.(news);
    onPopupToggle?.(false);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    onPopupToggle?.(true);
  };

  // Debugging: Log news item
  console.log('NewsCard News Item:', news);

  // Format the date
  const formattedDate = formatDate(news.created_at);

  // Determine card layout based on whether it's top news or reel mode
  const cardClasses = isTopNews 
    ? `
      group relative 
      w-full 
      rounded-3xl 
      overflow-hidden 
      shadow-2xl 
      border border-gray-100
      transition-all 
      duration-300 
      hover:shadow-xl 
      hover:scale-[1.01]
      cursor-pointer
      ${className}
    `
    : `
      group relative 
      bg-white border border-gray-100 
      rounded-2xl overflow-hidden 
      shadow-md 
      transition-all duration-300 
      cursor-pointer 
      transform hover:-translate-y-2 
      hover:shadow-lg 
      hover:border-[#17d059]/30
      ${className}
    `;

  return (
    <>
      <article 
        onClick={handleOpenPopup}
        className={cardClasses}
        style={{ 
          minHeight: isTopNews ? '500px' : '300px',
          position: 'relative'
        }}
      >
        {/* Full Image */}
        <div className="w-full h-full absolute inset-0">
          <img 
            src={news.image_url} 
            alt={news.title}
            className="
              w-full h-full 
              object-cover 
              transition-transform 
              duration-300 
              group-hover:scale-105
            "
            onError={(e) => {
              console.error('Image load error:', e);
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=News+Image';
            }}
          />
        </div>

        {/* Overlay with Black Shade and Content */}
        <div className="
          absolute 
          inset-0 
          bg-black/60 
          flex 
          items-end 
          p-6 
          text-white
        ">
          <div className="w-full">
            {/* Breaking News Badge */}
            <div className="
              bg-[#17d059] 
              text-white 
              px-3 py-1 
              rounded-full 
              text-xs 
              font-bold 
              uppercase 
              tracking-wider 
              inline-block 
              mb-3
            ">
              Breaking News
            </div>

            {/* Title */}
            <h3 className={`
              ${isTopNews 
                ? 'text-3xl font-bold' 
                : 'text-xl font-semibold'
              } 
              text-white 
              line-clamp-2 
              mb-3
            `}>
              {news.title}
            </h3>

            {/* Subtitle */}
            <p className={`
              ${isTopNews 
                ? 'text-base' 
                : 'text-sm'
              } 
              text-white/90 
              line-clamp-2 
              mb-4
            `}>
              {news.subtitle}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>{formattedDate}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </article>

      {/* Popup */}
      {isPopupOpen && (
        <NewsDetailPopup 
          news={news} 
          onClose={handleClosePopup}
          onPopupToggle={onPopupToggle}
        />
      )}
    </>
  );
}