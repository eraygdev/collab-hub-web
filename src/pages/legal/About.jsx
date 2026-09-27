import Legal from '../../components/layout/Legal';

export default function About() {
  const sections = [
    {
      id: 'misyon',
      title: 'Misyonumuz',
      content: (
        <>
          <p>
            Collab-Hub, geliştiricilerin açık kaynak projelerini paylaşabileceği,
            keşfedebileceği ve birlikte çalışabileceği bir platformdur.
            Amacımız, fikirlerin hızla hayata geçmesini ve doğru insanlarla
            buluşmasını sağlamak.
          </p>
          <p>
            Projeni yayınla, katkıda bulunacak geliştiriciler bul, ekibini kur.
            Hepsi tek bir yerde.
          </p>
        </>
      ),
    },
    {
      id: 'nasil-calisir',
      title: 'Nasıl Çalışır?',
      content: (
        <>
          <p>Collab-Hub üç basit adımdan oluşur:</p>
          <ul>
            <li>
              <strong>Keşfet:</strong> Kategorilere göre filtrele, ara, beğendiğin
              projeleri yıldızla.
            </li>
            <li>
              <strong>Paylaş:</strong> Kendi projeni oluştur, GitHub ve demo
              linklerini ekle, ekibini kur.
            </li>
            <li>
              <strong>Katkıda Bulun:</strong> İlgi duyduğun projelere katıl,
              geliştiricilerle iletişime geç.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'acik-kaynak',
      title: 'Açık Kaynak',
      content: (
        <>
          <p>
            Collab-Hub bir <strong>açık kaynak proje platformudur</strong>.
            Projenin kendisi de açık kaynak olarak geliştirilmektedir. Kod,
            öneri ve geri bildirimlere her zaman açığız.
          </p>
          <p>
            GitHub üzerinden katkıda bulunabilir, hata bildirebilir veya yeni
            özellik önerebilirsin.
          </p>
        </>
      ),
    },
    {
      id: 'iletisim',
      title: 'İletişim',
      content: (
        <>
          <p>
            Soruların, önerilerin veya iş birliği taleplerin için bize
            ulaşabilirsin:
          </p>
          <ul>
            <li>
              GitHub:{' '}
              <a
                href="https://github.com/eraygdev"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/eraygdev
              </a>
            </li>
            <li>
              E-posta:{' '}
              <a href="mailto:retadeveloper@gmail.com">
                retadeveloper@gmail.com
              </a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <Legal
      title="Hakkımızda"
      updatedAt="27 Eylül 2026"
      sections={sections}
    />
  );
}