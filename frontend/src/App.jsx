import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MovieDetailsPage from './pages/MovieDetailPage'
import MoviesPage from "./pages/MoviesPage";

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/movies" element={<MoviesPage />} />
      </Routes>

      <Footer companyName={import.meta.env.VITE_REF_COMPANY} />
    </div>
  );
}

export default App;
