import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full px-4 py-10 text-center text-sm text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Ayarlar.
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Hesap tercihlerini yönet.
          </p>
        </div>

        {/* Yakında */}
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-sm text-gray-500">
            Hesap ayarları, bildirim tercihleri ve gizlilik seçenekleri yakında burada olacak.
          </p>
        </div>

      </div>
    </div>
  );
}