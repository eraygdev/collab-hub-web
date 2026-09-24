import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Avatar + dropdown menü. Hem giriş yapmış hem yapmamış kullanıcı için.
export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef(null);

  // Menü kapanınca onay durumunu da sıfırla.
  useEffect(() => {
    if (!open) setConfirmLogout(false);
  }, [open]);

  // Dışına tıklayınca menüyü kapat.
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        // Onay ekranı açıksa önce onu iptal et, menüyü açık bırak.
        if (confirmLogout) {
          setConfirmLogout(false);
        } else {
          setOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, confirmLogout]);

  // Giriş yapılmamışsa: avatar tıklanınca login'e yönlendir.
  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-black transition-all"
        aria-label="Giriş Yap"
      >
        <svg className="w-5 h-5 text-gray-500 mt-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>
    );
  }

  // Avatar görseli var mı ve yüklenebiliyor mu?
  const showImage = user.avatar_url && !avatarError;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar butonu */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-black transition-all"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Kullanıcı menüsü"
      >
        {showImage ? (
          <img
          src={user.avatar_url}
          alt={user.username}
          loading="lazy"
          decoding="async"
          width="36"
          height="36"
          className="w-full h-full object-cover"
          onError={() => setAvatarError(true)}
        />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500 mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
        >
          {/* Kullanıcı başlığı */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-black truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Normal menü ya da onay ekranı */}
          {!confirmLogout ? (
            <>
              {/* Menü öğeleri */}
              <Link
                to="/dashboard"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Profilim
              </Link>
              <Link
                to="/create-project"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Yeni Proje Oluştur
              </Link>
              <Link
                to="/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Ayarlar
              </Link>

              {/* Ayraç */}
              <div className="border-t border-gray-100" />

              {/* Çıkış tetikleyicisi */}
              <button
                role="menuitem"
                onClick={() => setConfirmLogout(true)}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              {/* Onay ekranı */}
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-black mb-1">
                  Emin misin?
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Hesabından çıkış yapılacak. Devam etmek istiyor musun?
                </p>
              </div>

              <div className="px-4 pb-3 flex gap-2">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Evet, Çıkış
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}