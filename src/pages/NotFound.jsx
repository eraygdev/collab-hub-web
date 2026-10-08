import { useLanguage } from '../i18n/LanguageContext';
import NotFoundScreen from '../components/ui/NotFoundScreen';
import * as Icon from '../components/ui/Icons';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <NotFoundScreen
      eyebrow={t('not_found.eyebrow')}
      bigText={t('not_found.code')}
      title={t('not_found.title')}
      description={t('not_found.desc')}
      primaryCta={{ label: t('not_found.back_home'), to: '/', icon: Icon.ArrowLeft }}
      secondaryCta={{ label: t('not_found.dashboard'), to: '/dashboard', icon: Icon.LayoutGrid }}
    />
  );
}