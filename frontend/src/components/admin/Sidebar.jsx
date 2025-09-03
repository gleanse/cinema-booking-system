import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaTicketAlt,
  FaTags,
  FaClock,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaVideo,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import ConfirmationModal from './ConfirmationModal';

const Sidebar = ({ isCollapsed: propIsCollapsed, onToggleCollapse }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isCollapsed =
    propIsCollapsed !== undefined ? propIsCollapsed : internalIsCollapsed;

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, loading } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: FaHome,
      path: '/admin',
      comingSoon: true,
    },
    {
      name: 'Movies',
      icon: FaVideo,
      path: '/admin/movies',
      comingSoon: true,
    },
    {
      name: 'Genres',
      icon: FaTags,
      path: '/admin/genres',
    },
    {
      name: 'Showtimes',
      icon: FaClock,
      path: '/admin/showtimes',
      comingSoon: true,
    },
    {
      name: 'Settings',
      icon: FaCog,
      path: '/admin/settings',
      comingSoon: true,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalIsCollapsed(!internalIsCollapsed);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    const result = await logout();
    if (result.success) {
      setShowLogoutConfirm(false);
      navigate('/login');
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* MOBILE overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ease-in-out cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50
        transform transition-all duration-300 ease-in-out
        ${
          isOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 lg:opacity-100'
        }
        lg:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-secondary dark:bg-secondary/90
        border-r border-inputbrdr
        flex flex-col
        h-screen
        shadow-xl
        overflow-hidden
        backdrop-blur-sm
        rounded-r-2xl
      `}
      >
        <div className="flex items-center justify-between p-4 border-b border-inputbrdr flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <FaTicketAlt className="w-8 h-8 text-primary transition-colors duration-200" />
              <span className="text-xl font-bold text-foreground transition-colors duration-200">
                Cinema Booking
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <FaTicketAlt className="w-8 h-8 text-primary transition-colors duration-200" />
            </div>
          )}
          <div className="flex items-center space-x-2">
            {/* collapse/expand button (DESKTOP ONLY)*/}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex p-2 rounded-lg hover:bg-primary/10 text-foreground transition-all duration-200 hover:scale-110 cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <FaChevronRight className="w-4 h-4 transition-transform duration-200 cursor-pointer" />
              ) : (
                <FaChevronLeft className="w-4 h-4 transition-transform duration-200 cursor-pointer" />
              )}
            </button>
            {/* close button (MOBILE ONLY) */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/10 text-foreground transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <FaTimes className="w-5 h-5 transition-transform duration-200 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* navigations */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.comingSoon ? '#' : item.path}
              className={`
                flex items-center space-x-3 p-3 rounded-lg
                transition-all duration-200 ease-out
                transform hover:translate-x-1
                group
                ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-lg scale-[1.02]'
                    : 'text-foreground hover:bg-primary/10 hover:text-primary'
                }
                ${
                  item.comingSoon
                    ? 'opacity-50 cursor-not-allowed hover:translate-x-0'
                    : 'cursor-pointer'
                }
              `}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium transition-all duration-200 whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-inputbrdr flex-shrink-0">
          <button
            onClick={handleLogoutClick}
            disabled={loading}
            className="
              flex items-center space-x-3 w-full p-3 rounded-lg
              text-foreground hover:bg-primary/10 hover:text-primary
              transition-all duration-200 ease-out
              transform hover:translate-x-1
              group
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
            "
            title={isCollapsed ? 'Sign out' : ''}
          >
            <FaSignOutAlt className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0 cursor-pointer" />
            {!isCollapsed && (
              <span className="font-medium transition-all duration-200 whitespace-nowrap cursor-pointer">
                {loading ? 'Signing out...' : 'Sign out'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE TOGGLE */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="
            fixed bottom-4 left-4 z-50 lg:hidden
            p-3 bg-primary text-white rounded-full
            shadow-lg hover:bg-primary/90
            transition-all duration-300 ease-in-out
            hover:scale-110
            animate-pulse
            cursor-pointer
          "
        >
          <FaBars className="w-6 h-6 transition-transform duration-200 cursor-pointer" />
        </button>
      )}

      {/* DESKTOP TOGGLE*/}
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="
            fixed left-20 top-4 z-40 hidden lg:flex
            p-2 bg-primary text-white rounded-r-full
            shadow-lg hover:bg-primary/90
            transition-all duration-300 ease-in-out
            hover:scale-105
            cursor-pointer
          "
          title="Expand sidebar"
        >
          <FaChevronRight className="w-4 h-4 cursor-pointer" />
        </button>
      )}

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of your account"
        confirmText="Sign Out"
        cancelText="Cancel"
        loading={loading}
        variant="warning"
      />
    </>
  );
};

export default Sidebar;
