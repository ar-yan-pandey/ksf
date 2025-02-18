import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Search, X, Zap, Layers, Send } from 'lucide-react';
import { supabase } from './lib/supabase';
import { NewsCard } from './components/NewsCard';
import { KSFLogo } from './components/KSFLogo';
import type { NewsItem } from './types/news';
import { NewsDetailPopup } from './components/NewsDetailPopup';
import { Footer } from './components/Footer';
import { FeatureComingSoonPopup } from './components/FeatureComingSoonPopup';

// Create a component to handle analytics tracking
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return null;
}

function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Navbar and popup states
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Reel mode state
  const [isReelMode, setIsReelMode] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  // Feature coming soon popup state
  const [isFeatureComingSoonOpen, setIsFeatureComingSoonOpen] = useState(false);

  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch news with dynamic filtering
  const fetchNews = async (reset = false) => {
    setLoading(true);
    
    try {
      // Start with base query
      let query = supabase
        .from('news')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply category filter if not 'All'
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      // Apply search filter if query exists
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,subtitle.ilike.%${searchQuery}%`
        );
      }

      // Pagination
      const from = reset ? 0 : (page - 1) * ITEMS_PER_PAGE;
      const to = reset ? ITEMS_PER_PAGE - 1 : (page * ITEMS_PER_PAGE) - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      // Update news state
      setNews(reset ? (data || []) : [...news, ...(data || [])]);
      
      // Check if there are more items
      setHasMore(count ? count > page * ITEMS_PER_PAGE : false);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch news on initial load and when search query changes
  useEffect(() => {
    fetchNews(true);
  }, [searchQuery, page]);

  // Load more functionality
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
    fetchNews();
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  // Handle selecting a news item from search results
  const handleSearchResultClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsSearchOpen(false);
  };

  // Close news popup
  const handleClosePopup = () => {
    setSelectedNews(null);
    setIsNavbarVisible(true);
  };

  // Handle reel mode navigation
  const handleNextReel = () => {
    if (currentReelIndex < news.length - 1) {
      setCurrentReelIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prevIndex => prevIndex - 1);
    }
  };

  // Toggle reel mode
  const toggleReelMode = () => {
    setIsReelMode(!isReelMode);
    setCurrentReelIndex(0);
  };

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
  };

  // Effect to handle URL-based news popup
  useEffect(() => {
    const handleUrlBasedNewsPopup = async () => {
      // Check if there's a news ID in the URL
      const pathSegments = window.location.pathname.split('/');
      const newsIdFromUrl = pathSegments[pathSegments.indexOf('news') + 1];

      if (newsIdFromUrl) {
        try {
          // First, check if the news is already in the current list
          const matchedNews = news.find(item => item.id === newsIdFromUrl);
          
          if (matchedNews) {
            // Open the popup for this specific news item
            setSelectedNews(matchedNews);
            return;
          }

          // If not in current list, fetch the specific news item
          const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', newsIdFromUrl)
            .single();

          if (error) throw error;

          if (data) {
            setSelectedNews(data);
          }
        } catch (error) {
          console.error('Error fetching specific news:', error);
        }
      }
    };

    // Run the function
    handleUrlBasedNewsPopup();
  }, [window.location.pathname, news]);

  // Handler to open feature coming soon popup
  const handleSubmitReport = () => {
    setIsFeatureComingSoonOpen(true);
  };

  // Handler to close feature coming soon popup
  const handleCloseFeatureComingSoon = () => {
    setIsFeatureComingSoonOpen(false);
  };

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID); // Use environment variable
    ReactGA.send('pageview'); // Send initial pageview
  }, []);

  return (
    <Router>
      <AnalyticsTracker />
      <div className="bg-gray-50 min-h-screen flex flex-col">
        {/* Modern Glassmorphic Header */}
        {isNavbarVisible && (
          <header className={`
            fixed top-0 left-0 right-0 z-20 
            transition-all duration-300 
            ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}
          `}>
            <div className="container mx-auto flex justify-between items-center p-4">
              <KSFLogo 
                className="w-24 h-10" 
                variant={!isNavbarVisible ? 'white' : 'default'}
              />
              <div className="flex items-center space-x-4">
                {/* Search Toggle */}
                <button 
                  onClick={handleSearchToggle}
                  className={`
                    text-gray-600 hover:text-gray-900 
                    bg-white/10 backdrop-blur-md 
                    p-2 rounded-full 
                    transition-all hover:bg-white/20
                    ${!isNavbarVisible ? 'text-white hover:text-white/80' : ''}
                  `}
                >
                  {isSearchOpen ? <X /> : <Search />}
                </button>
                {/* Submit Your Report button */}
                <button style={{border: '1.5px solid white'}} 
                  onClick={handleSubmitReport}
                  className="
                    bg-[#17d059] 
                    text-white 
                    px-4 py-2 
                    rounded-full 
                    hover:bg-[#17d059]/90 
                    transition-colors 
                    flex items-center 
                    gap-2
                    ml-4
                  "
                >
                  <Send className="w-4 h-4" />
                  Submit Your Report
                </button>
              </div>
            </div>

            {/* Search and Filter Overlay */}
            {isSearchOpen && (
              <div className="fixed inset-x-0 top-16 z-30 
                              bg-white/90 backdrop-blur-xl 
                              shadow-2xl rounded-b-2xl p-6 
                              animate-slide-down">
                <div className="container mx-auto max-w-2xl">
                  {/* Enhanced Search Input */}
                  <div className="relative group">
                    <input 
                      type="text"
                      placeholder="Search news, topics, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 pl-12 
                                 bg-gray-100/70 border-2 border-transparent 
                                 rounded-xl text-gray-800 
                                 focus:outline-none focus:ring-0 
                                 focus:border-[#17d059]/50 
                                 transition-all duration-300 
                                 text-base font-medium 
                                 placeholder-gray-500 
                                 group-hover:bg-gray-100/80 
                                 group-hover:shadow-md"
                    />
                    <Search className="absolute left-4 top-1/2 
                                       transform -translate-y-1/2 
                                       text-gray-400 
                                       group-hover:text-[#17d059]/70 
                                       transition-colors duration-300 
                                       w-5 h-5" />
                    
                    {/* Clear Search Button */}
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 
                                   transform -translate-y-1/2 
                                   text-gray-400 hover:text-gray-600 
                                   transition-colors duration-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Search Hints or Recent Searches */}
                  {!searchQuery && (
                    <div className="mt-4 text-center text-gray-500 
                                    text-sm italic">
                      Try searching for "Tech", "Campus Events", or "Student Achievements"
                    </div>
                  )}

                  {/* Search Results Preview or Placeholder */}
                  {searchQuery && (
                    <div className="mt-6 bg-white/50 rounded-xl 
                                    p-4 shadow-inner 
                                    max-h-[50vh] overflow-y-auto">
                      {loading ? (
                        <div className="flex justify-center items-center 
                                        text-gray-500 animate-pulse">
                          Searching...
                        </div>
                      ) : news.length > 0 ? (
                        <div className="grid gap-3">
                          {news.slice(0, 5).map((item) => (
                            <div 
                              key={item.id} 
                              onClick={() => handleSearchResultClick(item)}
                              className="bg-white/70 rounded-lg 
                                         p-3 hover:bg-[#17d059]/10 
                                         transition-colors cursor-pointer"
                            >
                              <h3 className="font-semibold text-sm 
                                               text-gray-800 truncate">
                                {item.title}
                              </h3>
                              <p className="text-xs text-gray-500 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          ))}
                          {news.length > 5 && (
                            <div className="text-center text-sm 
                                            text-gray-500 mt-2">
                              + {news.length - 5} more results
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 italic">
                          No results found. Try a different search term.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </header>
        )}

        {/* Modern Hero Section */}
        <section className="relative overflow-hidden 
                            bg-gradient-to-br from-[#17d059] via-green-500 to-teal-400 
                            text-white pt-16 pb-16  
                            before:absolute before:top-0 before:left-0 
                            before:w-full before:h-full 
                            before:bg-noise before:opacity-10">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex flex-col items-center">
              {/* Add Light Logo to Hero Section */}
              <KSFLogo 
                className="w-48 h-24 mb-4" 
                variant="white"
              />
              <h1 className="text-4xl md:text-6xl font-extrabold 
                             mb-4 bg-clip-text text-transparent 
                             bg-gradient-to-r from-white to-white/70 
                             drop-shadow-lg">
                KIIT Student Forum
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto 
                            leading-relaxed opacity-90 
                            mb-6 font-medium">
                An independent platform dedicated to amplifying student voices, 
                sharing campus news, and fostering a vibrant community at KIIT University.
              </p>
              
              {/* Reel Mode Toggle */}
              <button style={{ marginBottom: '15px' }} 
                onClick={toggleReelMode}
                className="
                  flex items-center gap-2 
                  bg-white/20 backdrop-blur-md 
                  text-white 
                  px-6 py-3 
                  rounded-full 
                  hover:bg-white/30 
                  transition-all 
                  duration-300
                  group
                "
              >
                <Layers className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                {isReelMode ? 'Exit Reel Mode' : 'Enter Reel Mode'}
              </button>
            </div>
          </div>
        </section>

        {/* Reel Mode View */}
        {isReelMode && news.length > 0 && (
          <div 
            className="fixed inset-0 z-50 bg-black overflow-y-scroll scrollbar-hide"
            style={{ 
              scrollSnapType: 'y mandatory',
              height: '100vh',
              overscrollBehavior: 'contain'
            }}
          >
            {news.map((newsItem) => (
              <div 
                key={newsItem.id}
                className="w-full h-screen flex-shrink-0"
                style={{
                  scrollSnapAlign: 'start'
                }}
              >
                <NewsCard 
                  news={newsItem} 
                  onPopupToggle={setIsNavbarVisible}
                  isTopNews={true}
                  className="w-full h-full"
                />
              </div>
            ))}

            {/* Exit Reel Mode Button */}
            <button 
              onClick={toggleReelMode}
              className="
                fixed top-4 right-4 
                bg-white/20 backdrop-blur-md 
                text-white 
                p-3 rounded-full 
                hover:bg-white/30 
                transition-all 
                z-60
                mb-4
              "
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* News Content */}
        <main className="container mx-auto -mt-16 relative z-10 px-4 flex-1">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-72 mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-10">{error}</div>
          ) : news.length === 0 ? (
            <div className="text-center py-10">No news found</div>
          ) : (
            <div className="space-y-8">
              {/* Debug: Log news length */}
              {console.log('News Items:', news)}

              {/* Featured Large News Item */}
              {news.length > 0 && (
                <div className="mb-8">
                  <NewsCard 
                    news={news[0]} 
                    onPopupToggle={setIsNavbarVisible}
                    onNewsClick={handleNewsClick}
                    isTopNews={true}
                  />
                </div>
              )}
              
              {/* Remaining news items */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.slice(1).map((newsItem) => (
                  <NewsCard 
                    key={newsItem.id} 
                    news={newsItem} 
                    onPopupToggle={setIsNavbarVisible}
                    onNewsClick={handleNewsClick}
                  />
                ))}
              </div>

              {/* Conditionally render Load More if there are more items */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={loadMore}
                    disabled={loading}
                    className={`
                      px-6 py-2 rounded-full 
                      bg-[#17d059] text-white 
                      hover:bg-[#17d059]/90 
                      transition-all duration-300
                      flex items-center gap-2
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {loading ? 'Loading...' : 'Load More'}
                    {!loading && <Zap className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* News Popup */}
        {selectedNews && (
          <NewsDetailPopup 
            news={selectedNews} 
            onClose={handleClosePopup}
            onPopupToggle={setIsNavbarVisible}
          />
        )}

        {/* Feature Coming Soon Popup */}
        {isFeatureComingSoonOpen && (
          <FeatureComingSoonPopup onClose={handleCloseFeatureComingSoon} />
        )}

        {/* Add Footer at the end of the main content */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
