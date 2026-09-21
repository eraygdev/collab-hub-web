import ProjectCard from '../components/ProjectCard';

const mockProjects = [
  { 
    id: 1, 
    title: 'Siber Güvenlik Analiz Aracı', 
    description: 'Bu proje siber güvenlik açıklarını otomatik taramak ve raporlamak için geliştirilmiş bir sistemdir.',
    categories: ['Security', 'Python', 'Linux', 'Network', 'Cyber']
  },
  { 
    id: 2, 
    title: 'E-Ticaret Mikroservis Altyapısı', 
    description: 'Yüksek trafikli e-ticaret siteleri için ölçeklenebilir ve güvenli arka plan servis mimarisi.',
    categories: ['Backend', 'Java', 'Spring Boot', 'Redis', 'Docker', 'Microservices']
  },
  { 
    id: 3, 
    title: 'AI Destekli Kod Asistanı', 
    description: 'Geliştiricilerin hata ayıklamasına yardımcı olan yapay zeka tabanlı terminal aracı.',
    categories: ['AI', 'Python', 'LLM', 'CLI', 'Developer Tools']
  },
  { 
    id: 4, 
    title: 'Gerçek Zamanlı Sohbet Uygulaması', 
    description: 'WebSockets kullanarak geliştirilmiş düşük gecikmeli anlık mesajlaşma platformu.',
    categories: ['Go', 'WebSockets', 'Real-time', 'Backend', 'Network']
  },
  { 
    id: 5, 
    title: 'Bulut Dosya Yönetim Sistemi', 
    description: 'Kullanıcıların dosyalarını güvenle depolayabileceği ve paylaşabileceği bulut tabanlı platform.',
    categories: ['Cloud', 'Storage', 'Node.js', 'AWS', 'Security']
  },
  { 
    id: 6, 
    title: 'Kripto Para Takip Paneli', 
    description: 'Anlık piyasa verilerini gösteren, grafik destekli modern kripto para izleme arayüzü.',
    categories: ['React', 'Tailwind', 'API', 'Finance', 'Web3']
  },
  { 
    id: 7, 
    title: 'Görev ve Proje Yönetim Aracı', 
    description: 'Takımların iş süreçlerini optimize etmek için tasarlanmış minimalist Kanban panosu.',
    categories: ['React', 'Frontend', 'Productivity', 'UI/UX']
  },
  { 
    id: 8, 
    title: 'API Rate Limiter Kütüphanesi', 
    description: 'Java ve Redis kullanarak geliştirilmiş yüksek performanslı istek sınırlandırma modülü.',
    categories: ['Java', 'Redis', 'Backend', 'Performance', 'Open Source']
  },
  { 
    id: 9, 
    title: 'Online Eğitim Platformu', 
    description: 'Öğrenciler ve eğitmenlerin bir araya geldiği interaktif canlı ders ve kurs sistemi.',
    categories: ['EdTech', 'Fullstack', 'WebRTC', 'React', 'Node.js']
  },
  { 
    id: 10, 
    title: 'Blog ve İçerik Yönetim Sistemi', 
    description: 'Markdown desteğine sahip, hızlı ve SEO uyumlu modern bir içerik yönetim motoru.',
    categories: ['CMS', 'Markdown', 'SEO', 'Vite', 'Blog']
  },
  { 
    id: 11, 
    title: 'Olay Takip ve Log Analizcisi', 
    description: 'Sunucu hata loglarını toplayıp anlamlandıran merkezi hata yönetim paneli.',
    categories: ['DevOps', 'Logging', 'Monitoring', 'Docker', 'Go']
  },
  { 
    id: 12, 
    title: 'Açık Kaynak Kod Deposu', 
    description: 'Geliştiricilerin projelerini sergileyebileceği ve iş birliği yapabileceği topluluk ağı.',
    categories: ['Community', 'Open Source', 'Collaboration', 'Fullstack']
  },
];

export default function Home() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* İçeriği ortalayan ve çok fazla kenara yapışmasını önleyen sınırlandırılmış alan */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black tracking-tight">Keşfet</h2>
          <p className="text-sm text-gray-500 mt-1">Topluluk tarafından oluşturulan en son projeleri inceleyin ve katılın.</p>
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