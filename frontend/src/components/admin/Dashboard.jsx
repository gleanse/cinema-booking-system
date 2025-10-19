import { useState, useEffect } from 'react';
import {
  FaFilm,
  FaMoneyBillWave,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaTicketAlt,
  FaStar,
  FaSync,
  FaExclamationTriangle,
  FaSpinner,
} from 'react-icons/fa';
import useBookingOverview from '../../hooks/useBookingOverview';

const Dashboard = () => {
  const { overview, summary, loading, error, refreshAll, clearError } =
    useBookingOverview();

  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    refreshAll().then(() => {
      setLastUpdated(new Date());
    });
  }, []);

  const handleRefresh = async () => {
    await refreshAll();
    setLastUpdated(new Date());
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-neutral/20 rounded animate-pulse w-64"></div>
              <div className="h-4 bg-neutral/15 rounded animate-pulse w-96"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-neutral/15 rounded animate-pulse w-32"></div>
              <div className="h-10 w-24 bg-neutral/20 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-neutral/15 rounded animate-pulse w-3/4"></div>
                  <div className="h-8 bg-neutral/20 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="h-12 w-12 bg-neutral/20 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Status Skeleton */}
          <div className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-neutral/20 rounded-lg animate-pulse"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-neutral/20 rounded animate-pulse w-32"></div>
                <div className="h-3 bg-neutral/15 rounded animate-pulse w-48"></div>
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-neutral/20 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-neutral/20 rounded animate-pulse w-20"></div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-4 bg-neutral/20 rounded animate-pulse w-16 ml-auto"></div>
                    <div className="h-3 bg-neutral/15 rounded animate-pulse w-12 ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Movies Skeleton */}
          <div className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-neutral/20 rounded-lg animate-pulse"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-neutral/20 rounded animate-pulse w-32"></div>
                <div className="h-3 bg-neutral/15 rounded animate-pulse w-48"></div>
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-neutral/20 rounded-lg animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-neutral/20 rounded animate-pulse w-32"></div>
                      <div className="h-3 bg-neutral/15 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-neutral/20 rounded animate-pulse w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends Skeleton */}
        <div className="mt-8 bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-neutral/20 rounded-lg animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-neutral/20 rounded animate-pulse w-32"></div>
              <div className="h-3 bg-neutral/15 rounded animate-pulse w-48"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="text-center">
                <div className="bg-neutral/10 rounded-lg p-3 space-y-2">
                  <div className="h-3 bg-neutral/15 rounded animate-pulse w-full"></div>
                  <div className="h-6 bg-neutral/20 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-neutral/15 rounded animate-pulse w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-accent/10 border border-accent rounded-lg p-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="h-6 w-6 text-accent mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Error Loading Dashboard
                </h3>
                <p className="text-neutral mt-1">{error}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={clearError}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Booking Dashboard
              </h1>
              <p className="text-neutral mt-2">
                Overview of your cinema booking performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-neutral">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                <FaSync
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Overview Metrics Grid */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Bookings */}
            <div className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {overview.total_bookings?.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FaTicketAlt className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    ₱{overview.total_revenue?.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <FaMoneyBillWave className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>

            {/* Today's Bookings */}
            <div className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral">
                    Today's Bookings
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {overview.today_bookings?.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <FaUsers className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </div>

            {/* Today's Revenue */}
            <div className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral">
                    Today's Revenue
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    ₱{overview.today_revenue?.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <FaChartLine className="h-6 w-6 text-accent" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Status Breakdown */}
          {summary && (
            <div className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FaMoneyBillWave className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Payment Status
                  </h3>
                  <p className="text-sm text-neutral">
                    Breakdown of booking payments
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {summary.payment_stats?.map((stat) => (
                  <div
                    key={stat.payment_status}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          stat.payment_status === 'paid'
                            ? 'bg-green-500'
                            : stat.payment_status === 'pending'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                      <span className="font-medium text-foreground capitalize">
                        {stat.payment_status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {stat.count} bookings
                      </p>
                      <p className="text-sm text-neutral">
                        ₱{stat.revenue?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Movies */}
          {summary && (
            <div className="bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <FaStar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Popular Movies
                  </h3>
                  <p className="text-sm text-neutral">Top performing films</p>
                </div>
              </div>

              <div className="space-y-4">
                {summary.popular_movies?.map((movie, index) => (
                  <div
                    key={movie.showtime__movie__title}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">
                          {movie.showtime__movie__title}
                        </p>
                        <p className="text-sm text-neutral">
                          {movie.bookings} bookings
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ₱{movie.revenue?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Trends */}
        {overview?.monthly_trends && overview.monthly_trends.length > 0 && (
          <div className="mt-8 bg-inputbg border border-inputbrdr rounded-xl p-6 shadow-form-s">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Monthly Trends
                </h3>
                <p className="text-sm text-neutral">
                  Daily booking performance this month
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {overview.monthly_trends.slice(-7).map((day) => (
                <div key={day.created_at__date} className="text-center">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs font-medium text-neutral mb-1">
                      {new Date(day.created_at__date).toLocaleDateString(
                        'en-US',
                        { weekday: 'short' }
                      )}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {day.daily_bookings}
                    </p>
                    <p className="text-xs text-neutral">
                      ₱{day.daily_revenue?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
