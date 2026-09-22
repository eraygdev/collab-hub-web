import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  // Token yoksa login'e yönlendir.
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Backend'den taze kullanıcı bilgisini çek (token doğrulama testi).
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMe(data))
      .catch(() => {});
  }, [user]);

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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-black mb-2">
          Merhaba, {user.username} 👋
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Buradan projelerini yönetebilir, yeni proje oluşturabilirsin.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              Token'dan gelen bilgi
            </h2>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">User ID:</span> {user.user_id}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              Backend'den gelen bilgi (/api/auth/me)
            </h2>
            {me ? (
              <>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Email:</span> {me.email}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Username:</span> {me.username}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Yükleniyor...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}