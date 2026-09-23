// Karakter sınırları — backend'deki kontrollerle uyumlu olmalı.

// Proje oluşturma limitleri
export const PROJECT_LIMITS = {
  title: 80,
  description: 150,
  longDescription: 500,
  githubUrl: 200,
  demoUrl: 200,
  imageUrl: 300,
  maxCategories: 5,
  visibleCategories: 12,
};

// Profil limitleri
export const PROFILE_LIMITS = {
  username: 30,
  bio: 150,
};

// Arama limitleri
export const SEARCH_LIMITS = {
  maxLength: 80,
};