import { Link } from 'react-router-dom';

// Legal sayfalar için ortak layout.
// - Breadcrumb
// - Başlık + son güncelleme tarihi
// - Sticky "İçindekiler" (TOC) sidebar
// - Koyu kart içinde prose içerik
//
// sections: [{ id: 'misyon', title: 'Misyonumuz', content: <p>...</p> }, ...]
export default function Legal({ title, updatedAt, sections = [] }) {
  return (
    <div className="w-full bg-bg px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6 font-mono">
          <Link to="/" className="hover:text-text transition-colors">
            ana sayfa
          </Link>
          <span className="text-accent/30">/</span>
          <span className="text-text font-medium truncate">{title.toLowerCase()}</span>
        </nav>

        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text mb-3">
            {title}
          </h1>
          {updatedAt && (
            <p className="text-xs text-text-muted font-mono">
              son güncelleme: {updatedAt}
            </p>
          )}
        </div>

        {/* İçerik + TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* TOC — masaüstünde sticky */}
          {sections.length > 0 && (
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-bold text-text uppercase tracking-wider mb-3 font-mono">
                  /içindekiler
                </p>
                <nav className="space-y-1.5">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-sm text-text-muted hover:text-text transition-colors leading-snug font-mono py-1 border-l-2 border-transparent hover:border-accent/40 pl-3 -ml-0.5"
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
            <div className="bg-surface border border-accent/10 rounded-2xl p-6 sm:p-8">
              <div className="space-y-8">
                {sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-24">
                    <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                      {s.title}
                    </h2>
                    <div className="text-sm sm:text-base text-text-muted leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-text-muted [&_li]:marker:text-accent/50 [&_strong]:text-text [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent/80">
                      {s.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* Alt bilgi */}
            <p className="mt-6 text-xs text-text-muted/70 text-center font-mono">
              bu sayfa bilgilendirme amaçlıdır · yasal danışmanlık değildir
            </p>
          </main>

        </div>
      </div>
    </div>
  );
}