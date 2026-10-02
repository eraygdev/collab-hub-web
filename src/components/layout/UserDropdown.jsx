import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) setConfirmLogout(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
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

  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="w-8 h-8 rounded-full bg-surface border border-accent/15 overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent/40 transition-all"
        aria-label="Giriş Yap"
      >
        <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>
    );
  }

  const showImage = user.avatar_url && !avatarError;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full bg-surface border border-accent/15 overflow-hidden cursor-pointer hover:border-accent/40 hover:ring-2 hover:ring-accent/10 transition-all"
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
            width="32"
            height="32"
            className="w-full h-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-surface border border-accent/20 rounded-xl shadow-2xl overflow-hidden z-[100]"
        >
          {/* Kullanıcı başlığı */}
          <div className="px-4 py-3 border-b border-accent/10">
            <p className="text-sm font-semibold text-text truncate font-mono">
              {user.username}
            </p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>

          {!confirmLogout ? (
            <>
              {/* ✅ Sıralama: Profilim en üstte */}
              <Link
                to={`/profile/${user.username}`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-bg/60 transition-colors"
              >
                Profilim
              </Link>
              <Link
                to="/dashboard"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-bg/60 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/create-project"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-bg/60 transition-colors"
              >
                Yeni Proje Oluştur
              </Link>
              <Link
                to="/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-bg/60 transition-colors"
              >
                Ayarlar
              </Link>

              <div className="border-t border-accent/10" />

              <button
                role="menuitem"
                onClick={() => setConfirmLogout(true)}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-text mb-1">
                  Emin misin?
                </p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Hesabından çıkış yapılacak. Devam etmek istiyor musun?
                </p>
              </div>

              <div className="px-4 pb-3 flex gap-2">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-text bg-transparent border border-accent/20 rounded-lg hover:bg-bg/60 transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-bg bg-red-400 rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
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