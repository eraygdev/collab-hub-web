import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/project/Home';
import UserProfile from './pages/user/UserProfile';
import Settings from './pages/user/Settings';
import Dashboard from './pages/user/Dashboard';
import CreateProject from './pages/project/CreateProject';
import EditProject from './pages/project/EditProject';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProjectDetail from './pages/project/ProjectDetail';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/auth/AuthCallback';

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
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 selection:bg-black selection:text-white">
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={`flex-1 flex flex-col w-full bg-gray-50 ${hideFooter ? 'overflow-hidden' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

const HIDE_FOOTER_ROUTES = ['/login', '/register', '/auth/callback'];

function AppContent() {
  const location = useLocation();
  const hideFooter = HIDE_FOOTER_ROUTES.includes(location.pathname);

  return (
    <Layout hideFooter={hideFooter}>
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}