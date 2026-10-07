import * as Icon from './Icons';

// Input/textarea altında görünen inline hata mesajı.
// Boş mesaj gelirse hiçbir şey render etmez.
export default function FieldError({ message }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="field-error-msg mt-1.5 text-mono-sm text-red-400 font-mono inline-flex items-center gap-1.5"
    >
      <Icon.Warning className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}