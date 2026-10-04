import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../../components/ui/Icons';

export default function Notifications() {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-accent/10 rounded-card p-6 sm:p-8">
      <div className="text-center py-12">
        <Icon.Inbox className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <h2 className="text-body font-bold text-text mb-1 font-mono">
          {t('settings.notifications.coming_soon_title')}
        </h2>
        <p className="text-body-sm text-text-muted">
          {t('settings.notifications.coming_soon_desc')}
        </p>
      </div>
    </div>
  );
}