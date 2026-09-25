import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/project/ProjectCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState('');

  // Token yoksa login'e yönlendir.
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Kullanıcının kendi projelerini çek.
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    fetch(`${API}/api/me/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Projeler yüklenemedi');
        return res.json();
      })
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setProjectsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setProjectsLoading(false);
      });
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

        {/* Başlık */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">
              Merhaba, {user.username} 👋
            </h1>
            <p className="text-sm text-gray-500">
              Buradan projelerini yönetebilir, yeni proje oluşturabilirsin.
            </p>
          </div>
          <Link
            to="/create-project"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Proje
          </Link>
        </div>

        {/* Projeler */}
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Projelerim
        </h2>

        {projectsLoading && (
          <div className="text-center py-20 text-sm text-gray-500">
            Projeler yükleniyor...
          </div>
        )}

        {error && !projectsLoading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-black mb-1">Projeler yüklenemedi</h3>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        )}

        {!projectsLoading && !error && (
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} showAuthor={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
                <div className="text-5xl mb-3">📦</div>
                <h3 className="text-lg font-bold text-black mb-1">
                  Henüz projen yok
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  İlk projeni oluşturarak başla.
                </p>
                <Link
                  to="/create-project"
                  className="inline-block px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Proje Oluştur
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}