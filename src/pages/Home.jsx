import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { mockProjects } from '../data/mockProjects';

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO — YENİ EKLENEN KISIM */}
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

      {/* KEŞFET — eski kod, aynen duruyor ama py-10 → pt-10 oldu */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black tracking-tight">Keşfet</h2>
            <p className="text-sm text-gray-500 mt-1">
              Topluluk tarafından oluşturulan en son projeleri inceleyin ve katılın.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}