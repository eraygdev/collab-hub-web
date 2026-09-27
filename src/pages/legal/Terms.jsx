import Legal from '../../components/layout/Legal';

export default function Terms() {
  const sections = [
    {
      id: 'kabul',
      title: 'Şartların Kabulü',
      content: (
        <>
          <p>
            Collab-Hub'a erişerek ve kullanarak bu kullanım şartlarını kabul
            etmiş sayılırsınız. Şartları kabul etmiyorsanız platformu
            kullanmayınız.
          </p>
        </>
      ),
    },
    {
      id: 'hesap',
      title: 'Hesap Sorumluluğu',
      content: (
        <>
          <p>Hesabınızla ilgili sorumluluklar:</p>
          <ul>
            <li>Hesap bilgilerinizin doğruluğundan siz sorumlusunuz.</li>
            <li>
              Hesabınız üzerinden yapılan tüm işlemlerden siz sorumlusunuz.
            </li>
            <li>
              Hesabınızın yetkisiz kullanımını fark ederseniz derhal bize
              bildirmelisiniz.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'icerik-kurallari',
      title: 'İçerik Kuralları',
      content: (
        <>
          <p>Platformda paylaştığınız içeriklerde şunlar yasaktır:</p>
          <ul>
            <li>Yasa dışı içerik</li>
            <li>Nefret söylemi, hakaret, tehdit</li>
            <li>Telif hakkı ihlali</li>
            <li>Spam, reklam, yanıltıcı içerik</li>
            <li>Kötü amaçlı yazılım veya zararlı kod</li>
            <li>Kişisel verilerin izinsiz paylaşımı</li>
          </ul>
          <p>
            Bu kurallara uymayan içerikler önceden bildirilmeksizin
            kaldırılabilir ve hesabınız askıya alınabilir.
          </p>
        </>
      ),
    },
    {
      id: 'fikri-mulkiyet',
      title: 'Fikri Mülkiyet',
      content: (
        <>
          <p>
            Yayınladığınız projelerin fikri mülkiyet hakları size aittir.
            Ancak platforma yükleyerek, içeriğinizi diğer kullanıcılara
            göstermek için bize sınırlı bir lisans vermiş olursunuz.
          </p>
          <p>
            Collab-Hub adı, logosu ve tasarımı bize aittir; izinsiz
            kullanılamaz.
          </p>
        </>
      ),
    },
    {
      id: 'sorumluluk-reddi',
      title: 'Sorumluluk Reddi',
      content: (
        <>
          <p>
            Collab-Hub "olduğu gibi" sunulur. Kesintisiz veya hatasız çalışma
            garantisi verilmez.
          </p>
          <p>
            Platformda paylaşılan projelerin doğruluğu, güvenliği veya
            yasallığı konusunda sorumluluk kabul edilmez. Kullanıcılar
            arasındaki etkileşimlerden doğacak sorunlardan Collab-Hub sorumlu
            tutulamaz.
          </p>
        </>
      ),
    },
    {
      id: 'hesap-silme',
      title: 'Hesap Askıya Alma ve Silme',
      content: (
        <p>
          Kullanım şartlarını ihlal eden hesaplar önceden bildirilmeksizin
          askıya alınabilir veya silinebilir. Hesabınızı dilediğiniz zaman
          kendiniz de silebilirsiniz.
        </p>
      ),
    },
    {
      id: 'degisiklikler',
      title: 'Şartlarda Değişiklik',
      content: (
        <p>
          Bu şartlar zaman zaman güncellenebilir. Değişiklikler bu sayfada
          yayınlandığı anda yürürlüğe girer. Platformu kullanmaya devam
          etmeniz, güncel şartları kabul ettiğiniz anlamına gelir.
        </p>
      ),
    },
    {
      id: 'uygulanacak-hukuk',
      title: 'Uygulanacak Hukuk',
      content: (
        <p>
          Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Anlaşmazlıklar
          durumunda Türkiye mahkemeleri yetkilidir.
        </p>
      ),
    },
  ];

  return (
    <Legal
      title="Kullanım Şartları"
      updatedAt="27 Eylül 2026"
      sections={sections}
    />
  );
}