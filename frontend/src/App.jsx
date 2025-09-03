import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MovieDetailsPage from './pages/MovieDetailPage';
import MoviesPage from './pages/MoviesPage';
import GenresPage from './pages/admin/GenresPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* PUBLIC PAGES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN ONLY PAGES */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="genres" element={<GenresPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminPage && (
        <Footer companyName={import.meta.env.VITE_REF_COMPANY} />
      )}
    </div>
  );
}

export default App;
