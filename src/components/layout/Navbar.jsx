import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserDropdown from './UserDropdown';

export default function Navbar({ onOpenSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Menüyü Aç"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link
            to="/"
            className="text-[26px] font-extrabold text-gray-900/70 hover:text-gray-900 transition-colors cursor-pointer font-dm"
          >
            Collab-Hub.
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `hidden sm:inline-flex items-center justify-center max-w-[140px] truncate px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-700 hover:text-black hover:bg-gray-100'
                  }`
                }
              >
                Merhaba, {user.username}
              </NavLink>
              <UserDropdown />
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-700 hover:text-black hover:bg-gray-100'
                  }`
                }
              >
                Giriş Yap
              </NavLink>
              <UserDropdown />
            </>
          )}
        </div>
      </div>
    </header>
  );
}