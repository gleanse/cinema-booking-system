import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useScrollToTop } from './hooks/utils/useScrollToTop';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MovieDetailsPage from './pages/MovieDetailPage';
import MoviesPage from './pages/MoviesPage';
import CinemaListPage from './pages/CinemaListPage';
import CinemaShowtimesPage from './pages/CinemaShowtimesPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
// ADMIN PAGES
import Sidebar from './components/admin/Sidebar';
import GenresPage from './pages/admin/GenresPage';
import AdminMoviesPage from './pages/admin/AdminMoviesPage';
import AdminCinemasPage from './pages/admin/AdminCinemasPage';
import AdminShowtimesPage from './pages/admin/AdminShowtimesPage';
import AdminAccountsPage from './pages/admin/AdminAccountsPage';

function App() {
  const location = useLocation();
  const scrollRef = useRef(null);

  const isAdminPage = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useScrollToTop(scrollRef);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAdminPage && <Navbar />}

      {/* FOR ADMIN SIDE BAR */}
      <div className="flex flex-1 overflow-hidden">
        {isAdminPage && !isLoginPage && (
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}

        {/* SCROLLABLE CONTENT AREA */}
        <div
          className={`flex-1 overflow-auto transition-all duration-300 ${
            isAdminPage && !isLoginPage
              ? sidebarCollapsed
                ? 'lg:ml-20'
                : 'lg:ml-64'
              : ''
          }`}
        >
          <Routes>
            {/* PUBLIC PAGES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:id" element={<MovieDetailsPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/cinemas" element={<CinemaListPage />} />
            <Route
              path="/cinemas/:cinemaId/showtimes"
              element={<CinemaShowtimesPage />}
            />
            <Route path="/booking/:showtimeId" element={<BookingPage />} />
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmationPage />}
            />
            <Route path="/login" element={<LoginPage />} />

            {/* ADMIN ONLY PAGES */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <div className="p-6 min-h-full">
                    <Routes>
                      <Route path="genres" element={<GenresPage />} />
                      <Route path="movies" element={<AdminMoviesPage />} />
                      <Route path="cinemas" element={<AdminCinemasPage />} />
                      <Route
                        path="showtimes"
                        element={<AdminShowtimesPage />}
                      />
                      <Route path="accounts" element={<AdminAccountsPage />} />
                    </Routes>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>

      {!isAdminPage && (
        <Footer companyName={import.meta.env.VITE_REF_COMPANY} />
      )}
    </div>
  );
}

export default App;
