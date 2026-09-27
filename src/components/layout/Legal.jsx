import { Link } from 'react-router-dom';

// Legal sayfalar için ortak layout.
// - Breadcrumb
// - Başlık + son güncelleme tarihi
// - Sticky "İçindekiler" (TOC) sidebar
// - Beyaz kart içinde prose içerik
//
// sections: [{ id: 'misyon', title: 'Misyonumuz', content: <p>...</p> }, ...]
export default function Legal({ title, updatedAt, sections = [] }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-black transition-colors">
            Ana Sayfa
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate">{title}</span>
        </nav>

        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mb-2">
            {title}
          </h1>
          {updatedAt && (
            <p className="text-xs text-gray-500">
              Son güncelleme: {updatedAt}
            </p>
          )}
        </div>

        {/* İçerik + TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* TOC — masaüstünde sticky */}
          {sections.length > 0 && (
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                  İÇİNDEKİLER
                </p>
                <nav className="space-y-1.5">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-sm text-gray-500 hover:text-black transition-colors leading-snug"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* İçerik */}
          <main className={`${sections.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} order-1 lg:order-2`}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="space-y-8">
                {sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-24">
                    <h2 className="text-lg sm:text-xl font-bold text-black mb-3">
                      {s.title}
                    </h2>
                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-gray-600">
                      {s.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* Alt bilgi */}
            <p className="mt-6 text-xs text-gray-400 text-center">
              Bu sayfa bilgilendirme amaçlıdır. Yasal danışmanlık değildir.
            </p>
          </main>

        </div>
      </div>
    </div>
  );
}