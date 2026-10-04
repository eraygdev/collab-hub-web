import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

// Legal sayfalar için ortak layout.
export default function Legal({ title, updatedAt, sections = [] }) {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-bg px-4 sm:px-6 lg:px-8 py-page">
      <div className="max-w-default mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-body-sm text-text-muted mb-6 font-mono">
          <Link to="/" className="hover:text-text transition-colors">
            {t('legal.breadcrumb_home')}
          </Link>
          <span className="text-accent/30">/</span>
          <span className="text-text font-medium truncate">{title.toLowerCase()}</span>
        </nav>

        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-h3 font-extrabold tracking-tight text-text mb-3">
            {title}
          </h1>
          {updatedAt && (
            <p className="text-caption text-text-muted font-mono">
              {t('legal.updated_at', { date: updatedAt })}
            </p>
          )}
        </div>

        {/* İçerik + TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* TOC */}
          {sections.length > 0 && (
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <p className="text-caption font-bold text-text uppercase tracking-wider mb-3 font-mono">
                  {t('legal.toc')}
                </p>
                <nav className="space-y-1.5">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-body-sm text-text-muted hover:text-text transition-colors leading-snug font-mono py-1 border-l-2 border-transparent hover:border-accent/40 pl-3 -ml-0.5"
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
            <div className="bg-surface border border-accent/10 rounded-card p-6 sm:p-8">
              <div className="space-y-8">
                {sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-24">
                    <h2 className="text-h5 font-bold text-text mb-3">
                      {s.title}
                    </h2>
                    <div className="text-body-sm sm:text-body text-text-muted leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-text-muted [&_li]:marker:text-accent/50 [&_strong]:text-text [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent/80">
                      {s.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* Alt bilgi */}
            <p className="mt-6 text-caption text-text-muted/70 text-center font-mono">
              {t('legal.footer_disclaimer')}
            </p>
          </main>

        </div>
      </div>
    </div>
  );
}