// ═══════════════════════════════════════════════════════════
// TÜRKÇE ÇEVİRİLER
// ═══════════════════════════════════════════════════════════

export const tr = {
  // ─── HOME ───
  home: {
    hero: {
      eyebrow: "Açık kaynak · Topluluk · Kollaborasyon",
      title_1: "Fikirlerini paylaş,",
      title_2: "ekibini kur.",
      subtitle:
        "Açık kaynak projeleri keşfet, katkıda bulun veya kendi projeni yayınla. Tüm geliştiriciler tek bir yerde.",
    },
    search: {
      placeholder: "Proje, kategori veya teknoloji ara...",
      aria_clear: "Aramayı temizle",
      button: "ara",
      warning_prefix: "Geçersiz karakter:",
      history_label: "Son Aramalar",
      history_clear: "tümünü temizle",
      history_remove: '"{{query}}" aramasını sil',
      no_results: "Sonuç bulunamadı",
      results_hint: "{{count}} proje bulundu · kaydır",
      no_results_hint: "sonuç bulunamadı",
    },
    quick: {
      create: "Proje Oluştur",
      dashboard: "Dashboard",
    },
    explore: {
      title: "/keşfet",
      subtitle: "Topluluk tarafından oluşturulan en son projeler.",
      view_normal: "Büyük kartlar",
      view_compact: "Küçük kartlar",
    },
    categories: {
      all: "tümü",
      more: "+{{count}} daha",
    },
    match: {
      label: "eşleşme:",
      any: "herhangi",
      all: "hepsi",
    },
    filters: {
      count: "{{count}} proje",
      count_with_categories: "{{count}} proje · {{catCount}} kategori",
      clear: "filtreleri temizle",
    },
    error: {
      title: "projeler yüklenemedi",
      retry: "tekrar dene",
    },
    load_more: "daha fazla yükle",
    load_more_loading: "yükleniyor",
    empty: {
      filtered_title: "sonuç bulunamadı",
      empty_title: "henüz proje yok",
      filtered_desc: "Arama veya filtre kriterlerine uygun proje yok.",
      empty_desc: "İlk projeyi sen oluştur!",
      clear_filters: "filtreleri temizle",
      create: "proje oluştur",
    },
  },

  // ─── NAVBAR ───
  navbar: {
    aria: {
      open_menu: "Menüyü Aç",
      close_menu: "Menüyü Kapat",
      search_users: "Kullanıcı ara",
      logo: "RepoReef ana sayfa",
    },
    auth: {
      login: "Giriş Yap",
      register: "Kayıt Ol",
    },
    mobile_search: {
      placeholder: "Kullanıcı ara...",
      aria_clear: "Temizle",
      warning_prefix: "Geçersiz karakter:",
      history_label: "Son Aramalar",
      history_clear: "tümünü temizle",
      history_remove: '"{{username}}" aramasını sil',
      no_results: "Sonuç bulunamadı",
    },
  },

  // ─── USER SEARCH ───
  user_search: {
    placeholder: "Kullanıcı ara...",
    aria_clear: "Temizle",
    history_label: "Son Aramalar",
    history_clear: "Tümünü temizle",
    history_remove: '"{{username}}" aramasını sil',
    no_results: "Sonuç bulunamadı",
  },

  // ─── USER DROPDOWN ───
  user_dropdown: {
    menu: "Kullanıcı menüsü",
    profile: "Profilim",
    dashboard: "Dashboard",
    new_project: "Yeni Proje Oluştur",
    settings: "Ayarlar",
    logout: "Çıkış Yap",
    confirm: {
      title: "Emin misin?",
      desc: "Hesabından çıkış yapılacak. Devam etmek istiyor musun?",
      cancel: "Vazgeç",
      yes: "Evet, Çıkış",
    },
  },

  // ─── SIDEBAR ───
  sidebar: {
    title: "Menü",
    aria: {
      menu: "Ana menü",
      close: "Menüyü Kapat",
    },
    home: "Home",
    dashboard: "Dashboard",
    new_project: "Yeni Proje",
    profile: "Profilim",
    settings: "Ayarlar",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    brand: "RepoReef · by Reta",
  },

  // ─── FOOTER ───
  footer: {
    cta: {
      welcome_user: "Hoş geldin, {{username}}",
      title: "Projeni Paylaş, Ekibe Katıl",
      desc_user: "Yeni bir proje oluştur veya paneline göz at.",
      desc_guest: "Hesap oluştur, projeni yayınla ve topluluğa katıl.",
      create: "Proje Oluştur",
      dashboard: "Dashboard",
      github_start: "GitHub ile Başla",
    },
    brand: {
      tagline:
        "Geliştiricilerin projelerini paylaştığı, keşfettiği ve ekibe katıldığı açık kaynak platform.",
    },
    section: {
      product: "/ürün",
      resources: "/kaynaklar",
      company: "/şirket",
    },
    link: {
      explore: "Keşfet",
      create: "Proje Oluştur",
      dashboard: "Dashboard",
      developer: "Geliştirici",
      contact: "İletişim",
      twitter: "Twitter",
      about: "Hakkımızda",
      privacy: "Gizlilik",
      terms: "Kullanım Şartları",
    },
    copyright: "© {{year}} RepoReef · by Reta",
    links: {
      privacy: "gizlilik",
      terms: "şartlar",
      cookies: "çerezler",
    },
    aria: {
      github: "GitHub Profili",
      email: "E-posta",
      twitter: "Twitter",
    },
  },

  // ─── LANGUAGE SWITCHER ───
  language_switcher: {
    aria: "Dili değiştir",
  },

  // ─── BREADCRUMB ───
  breadcrumb: {
    home: "ana sayfa",
    dashboard: "dashboard",
    settings: "ayarlar",
    profile_self: "profilim",
    profile_other: "profil:{{username}}",
    project: "proje:{{id}}",
    new_project: "yeni proje",
    edit: "düzenle",
    about: "hakkımızda",
    privacy: "gizlilik",
    terms: "şartlar",
    cookies: "çerezler",
  },

  // ─── DASHBOARD ───
  dashboard: {
    greeting: "Merhaba, {{username}}",
    subtitle:
      "Projelerini yönet, başvuruları değerlendir, yeni fikirler yayınla.",
    view_profile: "Profilim",
    stat: {
      projects: "proje",
      stars: "yıldız",
      contributors: "katkıcı",
      pending: "bekleyen",
    },
    new_project: "Yeni Proje",
    tab: {
      projects: "/projelerim",
      requests: "/gelen başvurular",
    },
    view_normal: "Büyük kartlar",
    view_compact: "Küçük kartlar",
    loading: "Yükleniyor...",
    error: "Projeler yüklenemedi",
    projects: {
      empty_title: "henüz projen yok",
      empty_desc: "İlk projeni oluşturarak başla.",
      empty_cta: "proje oluştur",
    },
    requests: {
      empty_title: "bekleyen başvuru yok",
      empty_desc: "Projelerine katılmak isteyenler burada görünecek.",
    },
    request: {
      wants_to_join: "şu projeye katılmak istiyor:",
      reject: "reddet",
      approve: "onayla",
    },
  },

  // ─── PROFILE ───
  profile: {
    loading: "Profil yükleniyor...",
    not_found_eyebrow: "profil · bulunamadı",
    not_found_title: "kullanıcı bulunamadı",
    not_found_desc: "@{{username}} adlı kullanıcı sistemde yok.",
    back_home: "Ana Sayfaya Dön",
    title_self: "Profilim",
    settings: "ayarlar",
    empty_bio: "henüz bir bio eklenmemiş.",
    stat: {
      projects: "proje",
      stars: "yıldız",
      contributors: "katkıcı",
    },
    tab: {
      projects: "/projelerim",
      contributions: "/katkıda bulunduğum",
    },
    section: {
      projects_self: "/projelerim",
      contributions: "/katkıda bulunduğum projeler",
      projects_other: "/projeler",
    },
    empty: {
      projects_self_title: "henüz projen yok",
      projects_other_title: "henüz proje yok",
      projects_self_desc: "İlk projeni oluşturarak başla.",
      projects_other_desc: "@{{username}} henüz proje paylaşmamış.",
      projects_cta: "proje oluştur",
      contributions_title: "henüz bir projeye katkıda bulunmadın",
      contributions_desc: "Keşfet sayfasından projelere göz at, ekibe katıl.",
      contributions_cta: "projeleri keşfet",
    },
    sort: {
      newest: "en yeni",
      popular: "en popüler",
    },
    new_project: "yeni proje",
    view_normal: "Büyük kartlar",
    view_compact: "Küçük kartlar",
  },

  // ─── SETTINGS ───
  settings: {
    title: "Ayarlar.",
    subtitle: "Hesap bilgilerini ve tercihlerini yönet.",

    // Sidebar navigasyon
    nav: {
      account: "Hesap",
      appearance: "Görünüm",
      notifications: "Bildirimler",
      danger: "Tehlikeli Bölge",
    },

    // Account sayfası
    account: {
      title: "Hesap",
      subtitle: "Profil bilgilerini yönet.",
      section: {
        profile: "/profil bilgileri",
      },
      avatar_label: "Profil fotoğrafı",
      avatar_hint: "GitHub hesabından otomatik geliyor.",
      username_label: "Kullanıcı Adı",
      email_label: "E-posta",
      email_hint: "GitHub hesabından geliyor, değiştirilemez.",
      bio_label: "Hakkımda",
      bio_placeholder: "Kendinden kısaca bahset...",
      submitting: "kaydediliyor...",
      submit: "değişiklikleri kaydet",
      success: "Profil başarıyla güncellendi.",
      error: {
        empty_username: "Kullanıcı adı boş olamaz.",
        username_too_long: "Kullanıcı adı en fazla {{max}} karakter olabilir.",
        bio_too_long: "Hakkımda en fazla {{max}} karakter olabilir.",
        username_taken: "Bu kullanıcı adı zaten alınmış",
        generic: "Bir hata oluştu",
        network: "Sunucuya bağlanılamadı",
      },
    },

    // Appearance sayfası
    appearance: {
      title: "Görünüm",
      subtitle: "RepoReef'un görünümünü özelleştir.",
      language_section: "/dil",
      language_label: "Arayüz dili",
      language_hint: "Arayüz için dili seç.",
      scale_section: "/yazı boyutu",
      scale_label: "Yazı boyutu",
      scale_hint: "Uygulamadaki metin ve boşlukların boyutunu ayarla.",
      scale_small: "Küçük",
      scale_medium: "Orta",
      scale_large: "Büyük",
      theme_section: "/tema",
      theme_label: "Tema",
      theme_hint: "RepoReef şu an sadece koyu temayı destekliyor.",
      theme_locked: "koyu (kilitli)",
    },

    // Notifications sayfası
    notifications: {
      title: "Bildirimler",
      subtitle: "Nelerden haberdar olmak istediğini seç.",
      coming_soon_title: "yakında",
      coming_soon_desc: "Bildirim tercihleri yakında kullanılabilir olacak.",
    },

    // Danger sayfası
    danger: {
      title: "Tehlikeli Bölge",
      subtitle: "Geri alınamaz ve yıkıcı işlemler.",
      section: "/hesabı sil",
      desc: "Hesabını sildiğinde tüm projelerin ve verilerin kalıcı olarak silinir.",
      button: "hesabı sil (yakında)",
    },

    // Mobil menü butonu
    menu_aria: "Ayarlar menüsünü aç",
  },
  // ─── AUTH ───
  auth: {
    loading: "Yükleniyor...",
    github_oauth_note:
      "RepoReef, kimlik doğrulama için GitHub OAuth kullanır. Şifre saklanmaz.",
  },

  login: {
    eyebrow: "giriş",
    title: "Tekrar hoş geldin.",
    subtitle: "Hesabına giriş yap ve kaldığın yerden devam et.",
    github_button: "GitHub ile Devam Et",
    no_account: "Hesabın yok mu?",
    register_link: "Kayıt ol",
  },

  register: {
    eyebrow: "kayıt",
    title: "Hesap oluştur.",
    subtitle: "Topluluğa katıl, projeni paylaş, ekibini kur.",
    github_button: "GitHub ile Kayıt Ol",
    terms_prefix: "Kayıt olurken",
    terms_link: "kullanım şartlarını",
    and: "ve",
    privacy_link: "gizlilik politikasını",
    terms_suffix: " kabul etmiş sayılırsın.",
    has_account: "Zaten hesabın var mı?",
    login_link: "Giriş yap",
  },

  callback: {
    loading: "giriş yapılıyor",
  },

  // ─── DETAILS ───
  details: {
    loading: "Proje yükleniyor...",
    not_found_eyebrow: "proje · bulunamadı",
    not_found_title: "proje bulunamadı",
    not_found_desc: "Aradığın proje silinmiş veya taşınmış olabilir.",
    back_home: "Ana Sayfaya Dön",
    edit: "düzenle",
    deleting: "siliniyor...",
    delete: "sil",
    delete_confirm:
      "Bu projeyi silmek istediğine emin misin? Bu işlem geri alınamaz.",
    delete_failed: "Silme başarısız oldu",
    section: {
      links: "/bağlantılar",
      contributors: "/katkıcılar ({{count}} / {{max}})",
      about: "/proje hakkında",
      info: "/proje bilgileri",
      share: "/paylaş",
    },
    meta: {
      stars: "yıldız",
      contributors: "katkıcı",
      status: "durum",
    },
    cta: {
      your_project: "bu proje senin · {{count}} yıldız",
      starring: "...",
      starred: "yıldızlandı ({{count}})",
      star: "yıldızla ({{count}})",
      leave: "projeden ayrıl",
      join: "ekibe katıl",
      owner: "bu projenin sahibisin",
      pending: "başvurun onay bekliyor",
    },
    share: {
      copied: "kopyalandı",
      copy: "linki kopyala",
      link: "link",
      twitter: "twitter",
      copy_success: "Link kopyalandı!",
      copy_failed: "Link kopyalanamadı",
    },
  },

  // ─── CREATE / EDIT ───
  create: {
    title: "Yeni proje oluştur.",
    subtitle: "Projeni topluluğa tanıt, katkıda bulunacak geliştiriciler bul.",
    title_label: "Proje Başlığı",
    title_placeholder: "Örn: AI Destekli Kod Asistanı",
    description_label: "Kısa Açıklama",
    description_placeholder: "Projeni 1-2 cümleyle özetle.",
    long_description_label: "Uzun Açıklama",
    long_description_placeholder:
      "Projenin detayları, kullanılan teknolojiler, hedef kitlesi... (opsiyonel)",
    github_label: "GitHub URL",
    github_placeholder: "https://github.com/kullanici/proje",
    github_hint: "Repo public olmalı. Örnek: github.com/kullanici/repo",
    demo_label: "Demo URL",
    demo_placeholder: "https://proje-demo.com (opsiyonel)",
    image_label: "Kapak Görseli URL",
    image_placeholder: "https://... (opsiyonel)",
    image_hint: "Görseli bir GitHub reposuna yükle, sonra linkini yapıştır.",
    image_hint_examples: [
      "github.com/.../.../blob/...?raw=true",
      "github.com/.../blob/...",
      "raw.githubusercontent.com/...",
    ],
    submitting: "kaydediliyor...",
    submit: "projeyi yayınla",
    cancel: "iptal",
    limit: {
      title: "Proje Limiti",
      active: "aktif",
      full: "dolu",
      remaining: "{{count}} proje daha oluşturabilirsin.",
      reached:
        "Maksimum proje sayısına ulaştın. Yeni proje için mevcut bir projeyi silmelisin.",
    },
    success: "Proje oluşturuldu! Yönlendiriliyorsun...",
    error: {
      title_required: "Başlık ve kısa açıklama zorunlu.",
      too_long: "{{field}} alanı en fazla {{max}} karakter olabilir.",
      github_invalid:
        "GitHub URL geçersiz. http:// veya https:// ile başlamalı.",
      demo_invalid: "Demo URL geçersiz. http:// veya https:// ile başlamalı.",
      image_invalid:
        "Görsel URL geçersiz. http:// veya https:// ile başlamalı.",
      generic: "Bir hata oluştu",
      network: "Sunucuya bağlanılamadı",
    },
  },

  edit: {
    title: "Projeyi düzenle.",
    subtitle: "Değişiklikleri kaydet veya iptal et.",
    submitting: "kaydediliyor...",
    submit: "değişiklikleri kaydet",
    cancel: "iptal",
    success: "Güncellendi! Yönlendiriliyorsun...",
    not_found_eyebrow: "düzenle · bulunamadı",
    not_found_title: "proje bulunamadı",
    not_found_desc:
      "Düzenlemeye çalıştığın proje yok veya düzenleme yetkin yok.",
    back_home: "Ana Sayfaya Dön",
  },

  // ─── LEGAL ───
  legal: {
    updated_at: "son güncelleme: {{date}}",
    footer_disclaimer:
      "bu sayfa bilgilendirme amaçlıdır · yasal danışmanlık değildir",
    breadcrumb_home: "ana sayfa",
    toc: "/içindekiler",
  },

  about: { title: "Hakkımızda" },
  privacy: { title: "Gizlilik Politikası" },
  terms: { title: "Kullanım Şartları" },
  cookies: { title: "Çerez Politikası" },

  // ─── NOT FOUND ───
  not_found: {
    eyebrow: "hata · 404",
    code: "4 0 4",
    title: "Sayfa bulunamadı",
    desc: "Aradığın sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.",
    back_home: "Ana Sayfaya Dön",
    dashboard: "Dashboard",
  },

  // ─── SMALL COMPONENTS ───
  category_picker: {
    title: "Kategori Seç",
    max_info: "En fazla {{max}} kategori · {{count}} seçili",
    loading: "Kategoriler yükleniyor...",
    error: "Kategoriler yüklenemedi. Backend çalışıyor mu?",
    error_hint: "Backend'in çalıştığından emin ol.",
    empty: "Kategori bulunamadı.",
    cancel: "İptal",
    confirm: "Onayla ({{count}})",
    close: "Kapat",
  },

  contributor_limit: {
    label: "Katkıcı Sınırı",
    selected: "{{count}} seçili",
    locked_hint: "Oluşturduktan sonra değiştirilemez.",
  },

  category_chips: {
    label: "Kategoriler",
    counter: "{{count}} / {{max}}",
    loading: "Kategoriler yükleniyor...",
    more: "+{{count}} daha",
    hint: "En fazla {{max}} kategori seçebilirsin. (Opsiyonel)",
  },

  join_request: {
    title: "Ekibe Katıl",
    desc: "Bu projeye katkıda bulunmak için başvuru gönder. Proje sahibi onayladığında ekibe katılacaksın.",
    premium_label: "Neden katılmak istiyorsun?",
    premium_badge: "(Premium)",
    message_placeholder:
      "Kısaca kendinden ve ne katkı sağlayabileceğinden bahset...",
    message_hint: "Mesajın proje sahibine iletilir. Opsiyonel.",
    premium_warning:
      "üyelik ile başvuruna kişisel bir mesaj ekleyebilirsin. Standart üyeler direkt başvuru gönderir.",
    premium_warning_strong: "Premium",
    cancel: "İptal",
    submit: "Başvuru Gönder",
    submitting: "Gönderiliyor...",
  },

  leave_confirm: {
    title: "Emin misin?",
    warning_title: "Bu projeden ayrılıyorsun.",
    warning_desc:
      "Katkıcı statün sona erecek. İstediğin zaman tekrar başvurabilirsin.",
    confirm_desc: "Devam etmek istediğinden emin misin?",
    cancel: "Vazgeç",
    submitting: "Ayrılıyor...",
    wait: "Bekle ({{count}}s)",
    confirm: "Evet, Ayrıl",
  },

  image_preview: {
    error: "Görsel yüklenemedi. URL'yi kontrol et.",
    too_large: "Görsel çok büyük (en fazla 2MB). Daha küçük bir görsel kullan.",
  },

  contributor_card: {
    label: "katkıcı",
  },

  remove_contributor: {
    title: "Katkıcıyı Çıkar",
    aria: "{{username}} adlı katkıcıyı projeden çıkar",
    desc: "{{username}} adlı katkıcıyı bu projeden çıkarmak istiyor musun?",
    warning_title: "Bu işlem geri alınamaz.",
    warning_desc:
      "{{username}} bu projedeki katkıcı statüsünü kaybedecek. İstediği zaman tekrar başvurabilir.",
    cancel: "Vazgeç",
    confirm: "Çıkar",
    submitting: "Çıkarılıyor...",
  },

  // ─── SCROLL HINT ───
  scroll_hint: {
    label: "kaydır ve keşfet",
    aria: "Keşfetmek için aşağı kaydır",
  },

  scroll_to_top: {
    aria: "Yukarı çık",
  },

  // ─── HATALAR (backend error code → mesaj) ───
  errors: {
    generic: "Bir hata oluştu",
    server_error: "Sunucu hatası, lütfen tekrar dene",

    // oturum
    missing_token: "Oturum bilgisi eksik",
    invalid_token: "Geçersiz oturum",
    invalid_claims: "Oturum bilgisi bozuk",
    invalid_user_id: "Kullanıcı kimliği geçersiz",

    // kullanıcı / profil
    user_not_found: "Kullanıcı bulunamadı",
    invalid_data: "Geçersiz veri",
    username_empty: "Kullanıcı adı boş olamaz",
    username_required: "Kullanıcı adı gerekli",
    username_taken: "Bu kullanıcı adı zaten alınmış",

    // proje
    project_not_found: "proje bulunamadı",
    invalid_project_id: "Geçersiz proje kimliği",
    title_and_description_required: "Başlık ve açıklama zorunlu",
    github_url_too_long: "GitHub URL çok uzun",
    demo_url_too_long: "Demo URL çok uzun",
    image_url_too_long: "Görsel URL çok uzun",
    invalid_github_url: "GitHub URL geçersiz",
    github_url_required: "GitHub repo URL'si zorunlu",
    github_repo_not_accessible:
      "Repo bulunamadı veya private. Public olduğundan emin ol.",
    invalid_demo_url: "Demo URL geçersiz",
    invalid_image_url: "Görsel URL geçersiz",
    image_url_must_be_github:
      "Görsel URL'i GitHub linki olmalı (github.com/.../blob/... veya raw.githubusercontent.com/...)",
    image_too_large: "Görsel çok büyük (en fazla 2MB)",
    cannot_star_own_project: "Kendi projeni yıldızlayamazsın",
    project_limit_reached: "Proje limitine ulaştın",

    // kategori
    invalid_category_id: "Geçersiz kategori",
    too_many_categories: "Çok fazla kategori seçildi",

    // katkıcı limiti
    invalid_contributor_limit: "Geçersiz katkıcı limiti",
    contributor_limit_reached: "Bu proje katkıcı limitine ulaştı",

    // katkıcı
    cannot_join_own_project: "Kendi projene katılamazsın",
    message_too_long: "Mesaj çok uzun",
    already_pending: "Başvurun zaten onay bekliyor",
    already_contributor: "Zaten bu projenin katkıcısısın",
    owner_cannot_leave: "Proje sahibi ayrılamaz",
    not_a_contributor: "Bu projede katkıcı değilsin",
    invalid_request_id: "Geçersiz başvuru kimliği",
    request_not_found: "Başvuru bulunamadı",

    // yetki
    forbidden: "Bu işlem için yetkin yok",

    // validation
    username_too_long: "Kullanıcı adı çok uzun",
    username_invalid_char: "Kullanıcı adı geçersiz karakter içeriyor",
    bio_too_long: "Hakkımda çok uzun",
    bio_invalid_char: "Hakkımda geçersiz karakter içeriyor",
    title_too_long: "Başlık çok uzun",
    title_invalid_char: "Başlık geçersiz karakter içeriyor",
    description_too_long: "Açıklama çok uzun",
    description_invalid_char: "Açıklama geçersiz karakter içeriyor",
    longDescription_too_long: "Uzun açıklama çok uzun",
    longDescription_invalid_char: "Uzun açıklama geçersiz karakter içeriyor",
    search_too_long: "Arama metni çok uzun",
    search_invalid_char: "Arama metni geçersiz karakter içeriyor",

    // min-length
    title_too_short: "Başlık çok kısa (en az 3 karakter)",
    description_too_short: "Açıklama çok kısa (en az 20 karakter)",
    username_too_short: "Kullanıcı adı çok kısa (en az 3 karakter)",

    // generic char warning
    invalid_char:
      'Geçersiz karakter: "{{char}}" — sadece harf, rakam, nokta ve alt çizgi kullanabilirsin.',
  },

  // ─── COMMON ───
  common: {
    cancel: "Vazgeç",
    confirm: "Onayla",
    wait: "Bekle ({{count}}s)",
    error_generic: "Bir hata oluştu",
    optional: "(opsiyonel)",
    required: "*",
    copied: "Link kopyalandı!",
    copy_failed: "Link kopyalanamadı",
    delete_failed: "Silme başarısız oldu",
    action_failed: "İşlem başarısız oldu",
  },
};
