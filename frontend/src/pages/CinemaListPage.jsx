import { useEffect } from 'react';
import CinemaList from '../components/CinemaList';
import useCinemasCRUD from '../hooks/useCinemasCRUD';

const CinemaListPage = ({ user = null }) => {
  const { cinemas, loading, error, fetchCinemas, clearError } =
    useCinemasCRUD(user);

  useEffect(() => {
    fetchCinemas('summary');
  }, [fetchCinemas]);

  return (
    <CinemaList
      cinemas={cinemas}
      loading={loading}
      error={error}
      onClearError={clearError}
    />
  );
};

export default CinemaListPage;
