import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLock,
  FaHome,
  FaFilm,
  FaBuilding,
  FaEnvelope,
  FaFileContract,
  FaShieldAlt,
  FaFacebook,
  FaGithub,
} from 'react-icons/fa';

const Footer = ({
  companyName = 'Cinema Booking System', // fallback only
  year = new Date().getFullYear(),
}) => {
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const adminOptionsRef = useRef(null);

  // close the drop down of admin access options when click or scroll to the background
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminOptionsRef.current &&
        !adminOptionsRef.current.contains(event.target)
      ) {
        setShowAdminOptions(false);
      }
    };

    const handleScroll = () => {
      setShowAdminOptions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <footer className="bg-footerbg text-foreground py-6 md:py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-3 text-base md:text-lg">
                Navigation
              </h4>
              <ul className="space-y-2 text-foreground text-sm md:text-base">
                <li>
                  <Link
                    to="/"
                    className="hover:text-footertxt-hover transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <FaHome className="text-xs md:text-sm" /> Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/movies"
                    className="hover:text-footertxt-hover transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <FaFilm className="text-xs md:text-sm" /> Movies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cinema"
                    className="hover:text-footertxt-hover transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <FaBuilding className="text-xs md:text-sm" /> Cinemas
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-3 text-base md:text-lg">Legal</h4>
              <ul className="space-y-2 text-foreground text-sm md:text-base">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-footertxt-hover transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <FaShieldAlt className="text-xs md:text-sm" /> Privacy
                    Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-footertxt-hover transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <FaFileContract className="text-xs md:text-sm" /> Terms of
                    Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-3 text-base md:text-lg">
                Contact
              </h4>
              <ul className="space-y-2 text-foreground text-sm md:text-base">
                <li>
                  <a
                    href="#https://www.facebook.com/SMCinemaGrandCentralOfficial"
                    className="hover:text-footertxt-hover transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <FaFacebook className="text-xs md:text-sm" /> Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/gleanse"
                    className="hover:text-footertxt-hover transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <FaGithub className="text-xs md:text-sm" /> GitHub
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-footertxt-hover transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <FaEnvelope className="text-xs md:text-sm" /> Email Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col items-center">
          <div className="relative mb-4" ref={adminOptionsRef}>
            {/* DROPDOWN menu of ADMIN access button */}
            {showAdminOptions && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-secondary rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <Link
                  to="/admin/login"
                  className="px-4 py-2 text-sm text-white hover:text-gray-300 transition-colors flex items-center gap-2"
                  onClick={() => setShowAdminOptions(false)}
                >
                  <FaLock className="h-3 w-3" /> Admin Sign In
                </Link>
              </div>
            )}

            {/* ADMIN access button */}
            <button
              onClick={() => setShowAdminOptions(!showAdminOptions)}
              className="text-foreground hover:text-gray-300 transition-colors cursor-pointer p-2 rounded-full hover:bg-gray-700 flex items-center gap-2"
              aria-label="Admin options"
            >
              <FaLock className="h-4 w-4" />
              <span className="text-sm">Admin Access</span>
            </button>
          </div>

          <div className="text-footertxt text-xs md:text-sm text-center space-y-2">
            <p>
              © {year} {companyName}. All rights reserved.
            </p>
            <p>
              © {year} Auldey Glen. This website is an academic project and is
              not intended for commercial purposes.
            </p>
            <p>
              {companyName} and its logos are used for reference only. This
              project is not affiliated with or endorsed by {companyName}.
            </p>
            <p>The content and branding are purely for educational purposes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
