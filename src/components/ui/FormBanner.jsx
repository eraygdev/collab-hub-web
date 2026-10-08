import * as Icon from './Icons';

// Form üstünde/altında görünen başarı/hata banner'ı.
//
// type: 'error' | 'success' | 'info'
export default function FormBanner({ type = 'error', message }) {
  if (!message) return null;

  const STYLES = {
    error: {
      wrapper: 'text-red-400 bg-red-400/10 border-red-400/20',
      Icon: Icon.Warning,
    },
    success: {
      wrapper: 'text-accent bg-accent/10 border-accent/20',
      Icon: Icon.Check,
    },
    info: {
      wrapper: 'text-accent bg-accent/10 border-accent/20',
      Icon: Icon.Info,
    },
  };

  const s = STYLES[type] || STYLES.error;
  const IconComponent = s.Icon;

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`text-body-sm ${s.wrapper} border rounded-button px-4 py-2.5 font-mono inline-flex items-center gap-2`}
    >
      <IconComponent className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}