import {
  HiOutlineHome,
  HiOutlineFilm,
  HiOutlineTicket,
  HiOutlineBuildingOffice2,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi2';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: HiOutlineHome },
    { name: 'Movies', href: '/movies', icon: HiOutlineFilm },
    { name: 'Cinemas', href: '/cinemas', icon: HiOutlineBuildingOffice2 },
    { name: 'My Bookings', href: '/bookings', icon: HiOutlineTicket },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-primary shadow-lg border-b border-secondary/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-accent p-2 rounded-lg transition-colors duration-300">
                <HiOutlineSparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white transition-colors duration-300">
                Cinema
              </span>
            </div>
          </div>

          {/* DEKSTOP navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.name;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => handleItemClick(item.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'bg-secondary text-primary shadow-md'
                        : 'text-secondary hover:text-white hover:bg-primary/80'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="text-secondary hover:text-white p-2 rounded-lg hover:bg-primary/80 transition-all duration-300"
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
                const isActive = activeItem === item.name;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => handleItemClick(item.name)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'bg-secondary text-primary shadow-md'
                        : 'text-secondary hover:text-white hover:bg-primary/80'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
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
