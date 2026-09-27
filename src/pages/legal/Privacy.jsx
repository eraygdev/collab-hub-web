import Legal from '../../components/layout/Legal';

export default function Privacy() {
  const sections = [
    {
      id: 'giris',
      title: 'Giriş',
      content: (
        <>
          <p>
            Bu gizlilik politikası, Collab-Hub platformunu kullanırken hangi
            verilerin toplandığını, nasıl kullanıldığını ve haklarınızı
            açıklar.
          </p>
          <p>
            Platformu kullanarak bu politikayı kabul etmiş sayılırsınız.
          </p>
        </>
      ),
    },
    {
      id: 'toplanan-veriler',
      title: 'Toplanan Veriler',
      content: (
        <>
          <p>Hesap oluşturduğunuzda ve platformu kullandığınızda şu veriler toplanır:</p>
          <ul>
            <li>
              <strong>Kimlik verileri:</strong> GitHub üzerinden gelen kullanıcı
              adı, e-posta adresi, avatar URL'i.
            </li>
            <li>
              <strong>Profil verileri:</strong> Biyografi, kullanıcı adı
              değişiklikleri.
            </li>
            <li>
              <strong>Proje verileri:</strong> Yayınladığınız projeler, başlık,
              açıklama, linkler, kategoriler.
            </li>
            <li>
              <strong>Etkileşim verileri:</strong> Yıldızlar, oturum açma
              kayıtları (audit log).
            </li>
            <li>
              <strong>Teknik veriler:</strong> IP adresi (audit log için),
              tarayıcı bilgisi.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'kullanim-amaci',
      title: 'Verilerin Kullanım Amacı',
      content: (
        <>
          <p>Toplanan veriler şu amaçlarla kullanılır:</p>
          <ul>
            <li>Hesabınızı oluşturmak ve yönetmek</li>
            <li>Projelerinizi yayınlamak ve görüntülemek</li>
            <li>Platform güvenliğini sağlamak</li>
            <li>Kötüye kullanımı tespit etmek ve önlemek</li>
            <li>Hizmeti geliştirmek</li>
          </ul>
        </>
      ),
    },
    {
      id: 'ucuncu-taraflar',
      title: 'Üçüncü Taraf Hizmetler',
      content: (
        <>
          <p>Collab-Hub şu üçüncü taraf hizmetleri kullanır:</p>
          <ul>
            <li>
              <strong>GitHub OAuth:</strong> Kimlik doğrulama için. GitHub'ın
              gizlilik politikası geçerlidir.
            </li>
            <li>
              <strong>Neon (PostgreSQL):</strong> Veritabanı barındırma.
            </li>
            <li>
              <strong>Vercel:</strong> Frontend barındırma.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'veri-guvenligi',
      title: 'Veri Güvenliği',
      content: (
        <>
          <p>
            Verileriniz şifreli bağlantılar üzerinden iletilir. Şifreler
            saklanmaz (GitHub OAuth kullanılır). JWT token'lar 7 gün geçerlidir.
          </p>
          <p>
            Ancak internet üzerinden hiçbir iletim %100 güvenli değildir.
            Verilerinizi korumak için endüstri standardı önlemler alıyoruz.
          </p>
        </>
      ),
    },
    {
      id: 'haklariniz',
      title: 'Haklarınız',
      content: (
        <>
          <p>KVKK ve GDPR kapsamında şu haklara sahipsiniz:</p>
          <ul>
            <li>Verilerinize erişim talep etme</li>
            <li>Yanlış verilerin düzeltilmesini isteme</li>
            <li>Hesabınızın ve verilerinizin silinmesini isteme</li>
            <li>Veri işlemeye itiraz etme</li>
          </ul>
          <p>
            Talepleriniz için{' '}
            <a href="mailto:retadeveloper@gmail.com">
              retadeveloper@gmail.com
            </a>{' '}
            adresine yazabilirsiniz.
          </p>
        </>
      ),
    },
    {
      id: 'degisiklikler',
      title: 'Politika Değişiklikleri',
      content: (
        <p>
          Bu politika zaman zaman güncellenebilir. Önemli değişiklikler
          platform üzerinden duyurulur. Güncel sürüm her zaman bu sayfada
          yayınlanır.
        </p>
      ),
    },
  ];

  return (
    <Legal
      title="Gizlilik Politikası"
      updatedAt="27 Eylül 2026"
      sections={sections}
    />
  );
}