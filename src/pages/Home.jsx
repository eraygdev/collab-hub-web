import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import CategoryModal from '../components/CategoryModal';
import { mockProjects } from '../data/mockProjects';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchMode, setMatchMode] = useState('or'); // 'or' | 'and'

  const VISIBLE_LIMIT = 12;

  const allCategories = useMemo(() => {
    const set = new Set();
    mockProjects.forEach((p) => {
      (p.categories || []).forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setMatchMode('or'); // modu da sıfırla
  };

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return mockProjects.filter((project) => {
      const categories = project.categories || [];

      // matchMode'a göre VE veya VEYA kontrolü
      let categoryMatch = true;
      if (selectedCategories.length > 0) {
        if (matchMode === 'and') {
          // HEPSİ projede olmalı
          categoryMatch = selectedCategories.every((cat) =>
            categories.includes(cat)
          );
        } else {
          // EN AZ BİRİ projede olmalı
          categoryMatch = selectedCategories.some((cat) =>
            categories.includes(cat)
          );
        }
      }

      if (!categoryMatch) return false;
      if (!term) return true;

      const inTitle = project.title.toLowerCase().includes(term);
      const inDescription = project.description.toLowerCase().includes(term);
      const inCategories = categories.some((c) =>
        c.toLowerCase().includes(term)
      );

      return inTitle || inDescription || inCategories;
    });
  }, [searchTerm, selectedCategories, matchMode]);

  const hasActiveFilters =
    searchTerm.trim() !== '' || selectedCategories.length > 0;

  return (
    <div className="w-full">

      {/* HERO */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Fikirlerini paylaş, ekibini kur.
          </h1>
          <p className="mt-3 text-base text-gray-500 max-w-xl">
            Açık kaynak projeleri keşfet, katkıda bulun veya kendi projeni yayınla.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/create-project"
              className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Proje Oluştur
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* KEŞFET */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <div className="max-w-7xl mx-auto">

          {/* Başlık + Arama */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="shrink-0">
              <h2 className="text-2xl font-bold text-black tracking-tight">Keşfet</h2>
              <p className="text-sm text-gray-500 mt-1">
                Topluluk tarafından oluşturulan en son projeleri inceleyin ve katılın.
              </p>
            </div>

            <div className="relative w-full lg:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Proje ara..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all"
              />
            </div>
          </div>

          {/* Kategori Chip'leri */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategories([])}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                  selectedCategories.length === 0
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                Tümü
              </button>

              {allCategories.slice(0, VISIBLE_LIMIT).map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}

              {allCategories.length > VISIBLE_LIMIT && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-gray-300 text-gray-600 hover:border-gray-500 hover:text-black transition-colors cursor-pointer"
                >
                  +{allCategories.length - VISIBLE_LIMIT} daha
                </button>
              )}
            </div>
          </div>

          {/* VE / VEYA Modu — sadece 2+ kategori seçiliyken görünür */}
          {selectedCategories.length > 1 && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500">Eşleşme:</span>
              <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                <button
                  onClick={() => setMatchMode('or')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    matchMode === 'or'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Herhangi biri
                </button>
                <button
                  onClick={() => setMatchMode('and')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    matchMode === 'and'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Hepsi
                </button>
              </div>
              <span className="text-gray-400">
                {matchMode === 'and'
                  ? '· seçili kategorilerin tümü olmalı'
                  : '· seçili kategorilerden en az biri olmalı'}
              </span>
            </div>
          )}

          {/* Sonuç bilgisi */}
          {hasActiveFilters && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                {filteredProjects.length} proje bulundu
                {selectedCategories.length > 0 && (
                  <> · {selectedCategories.length} kategori seçili</>
                )}
              </p>
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-black underline transition-colors cursor-pointer"
              >
                Filtreleri temizle
              </button>
            </div>
          )}

          {/* Projeler */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-black mb-1">Sonuç bulunamadı</h3>
              <p className="text-sm text-gray-500 mb-4">
                Arama veya filtre kriterlerine uyan proje yok.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Kategori Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(newSelection) => setSelectedCategories(newSelection)}
        categories={allCategories}
        selectedCategories={selectedCategories}
      />
    </div>
  );
}