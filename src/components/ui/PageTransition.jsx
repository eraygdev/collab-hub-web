import { useLocation } from 'react-router-dom';

// Route değişince içeriği yumuşak fade + slide up ile gösterir.
// Tüm sayfalara otomatik uygulanır — her sayfaya ekleme gerekmez.
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="animate-page-enter"
    >
      {children}
    </div>
  );
}