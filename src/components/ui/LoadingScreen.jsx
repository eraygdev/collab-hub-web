// Basit tam sayfa yükleme ekranı.
export default function LoadingScreen({ message }) {
  return (
    <div className="w-full bg-bg min-h-screen flex items-center justify-center">
      <p className="text-body-sm text-text-muted font-mono">{message}</p>
    </div>
  );
}