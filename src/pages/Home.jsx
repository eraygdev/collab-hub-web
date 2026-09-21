import ProjectCard from '../components/ProjectCard';
import { mockProjects } from '../data/mockProjects';

export default function Home() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
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
  );
}