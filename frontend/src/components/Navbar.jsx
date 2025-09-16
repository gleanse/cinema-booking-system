import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useTheme from '../hooks/useTheme';
import {
  HiOutlineHome,
  HiOutlineFilm,
  HiOutlineTicket,
  HiOutlineBuildingOffice2,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi2';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const navItems = [
    { name: 'Home', to: '/', icon: HiOutlineHome },
    { name: 'Movies', to: '/movies', icon: HiOutlineFilm },
    { name: 'Cinemas', to: '/cinemas', icon: HiOutlineBuildingOffice2 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary/85 backdrop-blur-md shadow-lg border-b border-secondary/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO (when in production it will get the assets logo from cloudinary cloud storage if its not available it will use the span element text instead) */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              {import.meta.env.VITE_LOGO_URL ? (
                <img
                  src={import.meta.env.VITE_LOGO_URL}
                  alt="Cinema Logo"
                  className="h-12 w-auto"
                />
              ) : (
                <span className="text-xl font-bold text-secondary">
                  SM Cinema
                </span>
              )}
            </NavLink>
          </div>

          {/* DEKSTOP navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                        isActive
                          ? 'bg-secondary text-white shadow-md'
                          : 'text-secondary hover:text-white hover:bg-primary/80'
                      }`
                    }
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="cursor-pointer text-secondary hover:text-white p-2 rounded-lg hover:bg-primary/80 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <HiOutlineSun className="h-5 w-5" />
              ) : (
                <HiOutlineMoon className="h-5 w-5" />
              )}
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-secondary hover:text-white p-2 rounded-lg hover:bg-primary/80 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <HiOutlineXMark className="h-6 w-6" />
                ) : (
                  <HiOutlineBars3 className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-secondary/20 mt-2 pt-2 transition-all duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ease-in-out ${
                        isActive
                          ? 'bg-secondary text-primary shadow-md'
                          : 'text-secondary hover:text-white hover:bg-primary/80'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
