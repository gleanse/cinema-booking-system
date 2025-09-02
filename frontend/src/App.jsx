import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MovieDetailsPage from './pages/MovieDetailPage';
import MoviesPage from './pages/MoviesPage';
import GenresPage from './pages/admin/GenresPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <Routes>
        {/* PUBLIC PAGES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/admin/login" element={<LoginPage />} />

        {/* ADMIN ONLY PAGES */}
        <Route
          path="/admin/genres"
          element={
            <ProtectedRoute>
              <GenresPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer companyName={import.meta.env.VITE_REF_COMPANY} />
    </div>
  );
}

export default App;
