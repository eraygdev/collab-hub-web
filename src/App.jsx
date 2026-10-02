import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import { ToastProvider } from './components/ui/Toast';
import PageTransition from './components/ui/PageTransition';
import Home from './pages/project/Home';
import UserProfile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import Dashboard from './pages/user/Dashboard';
import CreateProject from './pages/project/Create';
import EditProject from './pages/project/Edit';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProjectDetail from './pages/project/Details';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/auth/Callback';
import About from './pages/legal/About';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Cookies from './pages/legal/Cookies';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children, hideFooter }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans text-text selection:bg-accent selection:text-bg">
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* main: flex-1 flex flex-col + overflow-x-hidden — içerik taşmasın */}
      <main
        className={`flex-1 flex flex-col w-full bg-bg min-h-0 overflow-x-hidden ${
          hideFooter ? 'overflow-y-hidden' : ''
        }`}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
      <ScrollToTopButton />
    </div>
  );
}

const HIDE_FOOTER_ROUTES = ['/login', '/register', '/auth/callback'];

function AppContent() {
  const location = useLocation();
  const hideFooter = HIDE_FOOTER_ROUTES.includes(location.pathname);

  return (
    <Layout hideFooter={hideFooter}>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project/:id/edit" element={<EditProject />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/project/:id" element={<ProjectDetail />} />

          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}