import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import * as Icon from '../../components/ui/Icons';

const NAV_ITEMS = [
  { to: '/settings/account', key: 'account', icon: 'User' },
  { to: '/settings/appearance', key: 'appearance', icon: 'Globe' },
  { to: '/settings/notifications', key: 'notifications', icon: 'Mail' },
  { to: '/settings/danger', key: 'danger', icon: 'Warning' },
];

export default function SettingsLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  // Route değişince mobil menüyü kapat
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Dışına tıklayınca + ESC ile kapat
  useClickOutside(menuRef, () => setMobileOpen(false), mobileOpen);

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-0 lg:gap-12">

          {/* SOL KOLON — başlık + nav birlikte, desktop'ta sticky */}
          <aside className="lg:sticky lg:top-14 lg:self-start lg:max-h-[calc(100vh-3.5rem)] lg:overflow-y-auto py-page">
            <div className="mb-6 lg:mb-8">
              <PageBreadcrumb
                items={[
                  { label: t('breadcrumb.home'), to: '/' },
                  { label: t('breadcrumb.settings') },
                ]}
              />
              <h1 className="text-h4 font-extrabold text-text mb-2 tracking-tight">
                {t('settings.title')}
              </h1>
              <p className="text-body-sm text-text-muted leading-relaxed">
                {t('settings.subtitle')}
              </p>
            </div>

            <nav
              className="hidden lg:flex flex-col gap-1"
              aria-label={t('settings.title')}
            >
              {NAV_ITEMS.map((item) => {
                const IconComponent = Icon[item.icon];
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 px-3.5 py-2.5 text-body-sm font-medium rounded-button transition-all font-mono border ${
                        isActive
                          ? 'bg-surface text-text border-accent/20'
                          : 'text-text-muted hover:text-text hover:bg-surface/60 border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {IconComponent && (
                          <IconComponent
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-accent' : 'text-text-muted'
                            }`}
                          />
                        )}
                        {t(`settings.nav.${item.key}`)}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          {/* SAĞ KOLON — içerik, akar */}
          <main className="pt-0 lg:py-page pb-10 min-w-0">
            <Outlet />
          </main>

        </div>
      </div>

      {/* MOBİL — sol altta yüzen buton + üstte açılan panel */}
      <div ref={menuRef} className="lg:hidden">

        {mobileOpen && (
          <div
            role="menu"
            className="fixed bottom-20 left-6 z-40 w-60 bg-surface border border-accent/20 rounded-card shadow-2xl overflow-hidden animate-modal-in"
          >
            <div className="px-3 py-2 border-b border-accent/10">
              <p className="text-mono-sm font-bold text-text-muted uppercase tracking-wider font-mono">
                {t('settings.title')}
              </p>
            </div>
            <nav className="p-1.5" aria-label={t('settings.title')}>
              {NAV_ITEMS.map((item) => {
                const IconComponent = Icon[item.icon];
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2.5 text-body-sm font-medium rounded-button transition-all font-mono ${
                        isActive
                          ? 'bg-accent/10 text-text'
                          : 'text-text-muted hover:text-text hover:bg-bg/60'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {IconComponent && (
                          <IconComponent
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-accent' : 'text-text-muted'
                            }`}
                          />
                        )}
                        {t(`settings.nav.${item.key}`)}
                        {isActive && (
                          <Icon.Check className="w-3.5 h-3.5 text-accent ml-auto" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label={t('settings.menu_aria')}
          aria-haspopup="menu"
          aria-expanded={mobileOpen}
          className={`fixed bottom-6 left-6 z-40 w-11 h-11 rounded-button backdrop-blur-md border flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 ${
            mobileOpen
              ? 'bg-accent text-bg border-accent shadow-[0_0_30px_-5px_rgba(239,228,206,0.5)]'
              : 'bg-bg/80 text-accent border-accent/20 hover:border-accent/60 hover:bg-bg/95 hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.35)]'
          }`}
        >
          {mobileOpen ? (
            <Icon.Close className="w-4 h-4" />
          ) : (
            <Icon.Settings className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}