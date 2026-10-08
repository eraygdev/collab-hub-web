import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import Avatar from '../ui/Avatar';
import * as Icon from '../ui/Icons';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) setConfirmLogout(false);
  }, [open]);

  useClickOutside(menuRef, () => setOpen(false), open);

  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="w-8 h-8 rounded-pill bg-surface border border-accent/15 overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent/40 transition-all"
        aria-label={t('user_dropdown.menu')}
      >
        <Icon.User className="w-4 h-4 text-text-muted" />
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-pill cursor-pointer hover:ring-2 hover:ring-accent/10 transition-all"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('user_dropdown.menu')}
      >
        <Avatar src={user.avatar_url} username={user.username} size="md" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-surface border border-accent/20 rounded-card shadow-2xl overflow-hidden z-100 animate-dropdown"
        >
          <div className="px-4 py-3 border-b border-accent/10">
            <p className="text-body-sm font-semibold text-text truncate font-mono">
              {user.username}
            </p>
            <p className="text-caption text-text-muted truncate">{user.email}</p>
          </div>

          {!confirmLogout ? (
            <>
              <Link
                to={`/profile/${user.username}`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-text-muted hover:text-text hover:bg-bg/60 transition-colors"
              >
                <Icon.User className="w-4 h-4" />
                {t('user_dropdown.profile')}
              </Link>
              <Link
                to="/dashboard"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-text-muted hover:text-text hover:bg-bg/60 transition-colors"
              >
                <Icon.LayoutGrid className="w-4 h-4" />
                {t('user_dropdown.dashboard')}
              </Link>
              <Link
                to="/create-project"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-text-muted hover:text-text hover:bg-bg/60 transition-colors"
              >
                <Icon.Plus className="w-4 h-4" />
                {t('user_dropdown.new_project')}
              </Link>
              <Link
                to="/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-text-muted hover:text-text hover:bg-bg/60 transition-colors"
              >
                <Icon.Settings className="w-4 h-4" />
                {t('user_dropdown.settings')}
              </Link>

              <div className="border-t border-accent/10" />

              <button
                role="menuitem"
                onClick={() => setConfirmLogout(true)}
                className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-body-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <Icon.Logout className="w-4 h-4" />
                {t('user_dropdown.logout')}
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-3">
                <p className="text-body-sm font-semibold text-text mb-1">
                  {t('user_dropdown.confirm.title')}
                </p>
                <p className="text-caption text-text-muted leading-relaxed">
                  {t('user_dropdown.confirm.desc')}
                </p>
              </div>

              <div className="px-4 pb-3 flex gap-2">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 px-3 py-2 text-caption font-semibold text-text bg-transparent border border-accent/20 rounded-button hover:bg-bg/60 transition-colors cursor-pointer"
                >
                  {t('user_dropdown.confirm.cancel')}
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex-1 px-3 py-2 text-caption font-semibold text-bg bg-red-400 rounded-button hover:bg-red-500 transition-colors cursor-pointer"
                >
                  {t('user_dropdown.confirm.yes')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}