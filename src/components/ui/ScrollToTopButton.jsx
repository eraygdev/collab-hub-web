import { useState, useEffect } from 'react';

// Sayfa aşağı kaydırılınca görünen "yukarı çık" butonu.
// 300px'den sonra görünür, tıklayınca yumuşak scroll ile başa döner.
//
// Tasarım: navbar gibi yarı şeffaf + blur + ince krem çerçeve.
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Yukarı çık"
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-bg/80 backdrop-blur-md border border-accent/20 text-accent hover:border-accent/60 hover:bg-bg/95 hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.35)] active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}