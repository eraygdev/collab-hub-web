import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../ui/Icons';

const SidebarLink = ({ to, label, onClose, children }) => (
  <Link
    to={to}
    onClick={onClose}
    className="flex items-center gap-3 px-4 py-3 text-body-sm font-medium text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-accent/10 rounded-card transition-all"
  >
    <span className="text-text-muted">{children}</span>
    {label}
  </Link>
);

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-bg/60 backdrop-blur-sm z-50 transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-surface z-50 shadow-2xl border-r border-accent/10 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label={t('sidebar.aria.menu')}
      >
        {/* Header — navbar ile aynı yükseklik */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-accent/10 shrink-0">
          <span className="font-sans text-body-sm font-semibold text-text tracking-tight">
            {t('sidebar.title')}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-button text-text-muted hover:text-text hover:bg-bg transition-colors cursor-pointer"
            aria-label={t('sidebar.aria.close')}
          >
            <Icon.Close className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">

          <SidebarLink to="/" label={t('sidebar.home')} onClose={onClose}>
            <Icon.Folder className="w-5 h-5" />
          </SidebarLink>

          {user ? (
            <>
              <SidebarLink to="/dashboard" label={t('sidebar.dashboard')} onClose={onClose}>
                <Icon.LayoutGrid className="w-5 h-5" />
              </SidebarLink>

              <SidebarLink to="/create-project" label={t('sidebar.new_project')} onClose={onClose}>
                <Icon.Plus className="w-5 h-5" />
              </SidebarLink>

              <SidebarLink to={`/profile/${user.username}`} label={t('sidebar.profile')} onClose={onClose}>
                <Icon.User className="w-5 h-5" />
              </SidebarLink>

              <SidebarLink to="/settings" label={t('sidebar.settings')} onClose={onClose}>
                <Icon.Settings className="w-5 h-5" />
              </SidebarLink>
            </>
          ) : (
            <div className="pt-4 mt-4 border-t border-accent/10 space-y-1">
              <SidebarLink to="/login" label={t('sidebar.login')} onClose={onClose}>
                <Icon.Login className="w-5 h-5" />
              </SidebarLink>

              <SidebarLink to="/register" label={t('sidebar.register')} onClose={onClose}>
                <Icon.User className="w-5 h-5" />
              </SidebarLink>
            </div>
          )}
        </nav>

        {/* Alt bant */}
        <div className="px-5 py-4 border-t border-accent/10 shrink-0">
          <p className="text-mono-sm text-text-muted font-mono uppercase tracking-wider">
            {t('sidebar.brand')}
          </p>
        </div>
      </aside>
    </>
  );
}