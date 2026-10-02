import { useLocation } from 'react-router-dom';

// Route değişince içeriği yumuşak fade + slide up ile gösterir.
// Tüm sayfalara otomatik uygulanır — her sayfaya ekleme gerekmez.
//
// `flex-1 flex flex-col` → sayfa içeriği tam yüksekliği kaplayabilir
// (Login, Register, NotFound gibi ortalanan sayfalar için gerekli).
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="animate-page-enter flex-1 flex flex-col w-full"
    >
      {children}
    </div>
  );
}