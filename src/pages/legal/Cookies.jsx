import Legal from '../../components/layout/Legal';

export default function Cookies() {
  const sections = [
    {
      id: 'nedir',
      title: 'Çerez Nedir?',
      content: (
        <>
          <p>
            Çerezler (cookies), ziyaret ettiğiniz web siteleri tarafından
            tarayıcınıza kaydedilen küçük metin dosyalarıdır. Oturumunuzu
            hatırlamak, tercihlerinizi saklamak ve deneyiminizi iyileştirmek
            için kullanılır.
          </p>
        </>
      ),
    },
    {
      id: 'kullandigimiz',
      title: 'Kullandığımız Çerezler',
      content: (
        <>
          <p>Collab-Hub şu çerezleri kullanır:</p>
          <ul>
            <li>
              <strong>Zorunlu çerezler:</strong> Oturum yönetimi ve güvenlik
              için gereklidir. Devre dışı bırakılamaz.
            </li>
            <li>
              <strong>Yerel depolama (localStorage):</strong> Giriş token'ınız
              ve form taslaklarınız tarayıcınızda saklanır.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'localstorage',
      title: 'LocalStorage Kullanımı',
      content: (
        <>
          <p>
            Collab-Hub, çerezlerin yanı sıra tarayıcınızın{' '}
            <strong>localStorage</strong> özelliğini de kullanır:
          </p>
          <ul>
            <li>
              <strong>token:</strong> Giriş yaptığınızda oluşturulan JWT
              token'ı. 7 gün geçerlidir.
            </li>
            <li>
              <strong>createProjectDraft:</strong> Yeni proje oluştururken
              girdiğiniz veriler. Siz kaydedene kadar tarayıcınızda kalır.
            </li>
          </ul>
          <p>
            LocalStorage verileri sunucuya gönderilmez, sadece tarayıcınızda
            saklanır.
          </p>
        </>
      ),
    },
    {
      id: 'ucuncu-taraf',
      title: 'Üçüncü Taraf Çerezleri',
      content: (
        <p>
          Şu an Collab-Hub üçüncü taraf reklam veya analitik çerezi
          kullanmamaktadır. Gelecekte eklenirse bu sayfa güncellenecektir.
        </p>
      ),
    },
    {
      id: 'kontrol',
      title: 'Çerezleri Nasıl Kontrol Ederim?',
      content: (
        <>
          <p>
            Tarayıcı ayarlarınızdan çerezleri ve localStorage verilerini
            silebilir veya engelleyebilirsiniz. Ancak:
          </p>
          <ul>
            <li>
              Çerezleri tamamen engellerseniz oturum açamazsınız.
            </li>
            <li>
              localStorage'ı temizlerseniz oturumunuz kapanır.
            </li>
          </ul>
          <p>
            Popüler tarayıcılar için ayarlar:
          </p>
          <ul>
            <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
            <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
            <li>Safari: Tercihler → Gizlilik → Çerezleri yönet</li>
          </ul>
        </>
      ),
    },
    {
      id: 'degisiklikler',
      title: 'Değişiklikler',
      content: (
        <p>
          Bu çerez politikası zaman zaman güncellenebilir. Güncel sürüm her
          zaman bu sayfada yayınlanır.
        </p>
      ),
    },
  ];

  return (
    <Legal
      title="Çerez Politikası"
      updatedAt="27 Eylül 2026"
      sections={sections}
    />
  );
}