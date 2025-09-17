import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HiCheckCircle,
  HiArrowDownTray,
  HiCalendarDays,
  HiClock,
  HiMapPin,
  HiUser,
  HiTicket,
  HiArrowLeft,
  HiShare,
} from 'react-icons/hi2';
import useBookingsCRUD from '../hooks/useBookingsCRUD';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, showtime } = location.state || {};

  // fully MOCK  for now
  const [bookingReference] = useState(`BK${Date.now().toString().slice(-8)}`);
  const [isDownloading, setIsDownloading] = useState(false);

  const { downloadTicket, loading, error } = useBookingsCRUD();

  useEffect(() => {
    if (!bookingData || !showtime) {
      navigate('/', { replace: true });
    }
  }, [bookingData, showtime, navigate]);

  const handleDownloadTicket = async () => {
    try {
      setIsDownloading(true);
      await downloadTicket(bookingReference);
    } catch (err) {
      console.error('Failed to download ticket:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareBooking = async () => {
    const shareData = {
      title: 'Movie Ticket Booking',
      text: `I just booked tickets for "${showtime.movie.title}"! Booking ref: ${bookingReference}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(
        `Movie: ${
          showtime.movie.title
        }\nBooking Reference: ${bookingReference}\nSeats: ${bookingData.selectedSeats.join(
          ', '
        )}`
      );
      alert('Booking details copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!bookingData || !showtime) {
    return null;
  }

  const totalAmount = (showtime.ticket_price * bookingData.quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6 group"
        >
          <HiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <HiCheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-neutral">
            Your movie tickets have been successfully booked
          </p>
          <div className="mt-4 inline-flex items-center bg-primary/10 px-4 py-2 rounded-lg">
            <HiTicket className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold text-primary">
              Booking Reference: {bookingReference}
            </span>
          </div>
        </div>

        <div className="bg-background rounded-2xl shadow-xl border border-neutral/10 dark:border-primary/20 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 border-b border-neutral/10">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {showtime.movie.poster ? (
                  <img
                    src={showtime.movie.poster}
                    alt={showtime.movie.title}
                    className="w-16 h-24 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gradient-to-br from-neutral/10 to-neutral/20 rounded-lg shadow-md flex items-center justify-center border border-neutral/20">
                    <HiTicket className="h-6 w-6 text-neutral/40" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {showtime.movie.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                    {showtime.movie.genre_detail.name}
                  </span>
                  <span className="bg-neutral/20 text-foreground px-2 py-1 rounded text-xs font-medium">
                    {showtime.movie.age_rating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* booking details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Booking Details
            </h3>

            <div className="space-y-4">
              {/* date & time */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <HiCalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {formatDate(showtime.show_date)}
                  </p>
                  <p className="text-sm text-neutral">
                    {formatTime(showtime.show_time)}
                  </p>
                </div>
              </div>

              {/* cinema & room */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <HiMapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {showtime.room.cinema_name}
                  </p>
                  <p className="text-sm text-neutral">{showtime.room.name}</p>
                </div>
              </div>

              {/* customer info */}
              {bookingData.customerInfo && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <HiUser className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {bookingData.customerInfo.name}
                    </p>
                    <p className="text-sm text-neutral">
                      {bookingData.customerInfo.email}
                    </p>
                  </div>
                </div>
              )}

              {/* seats */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <HiTicket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Seats: {bookingData.selectedSeats.join(', ')}
                  </p>
                  <p className="text-sm text-neutral">
                    {bookingData.quantity}{' '}
                    {bookingData.quantity === 1 ? 'ticket' : 'tickets'}
                  </p>
                </div>
              </div>
            </div>

            {/* payment summary */}
            <div className="bg-gradient-to-r from-neutral/5 to-neutral/10 rounded-xl p-4 mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral">Price per ticket:</span>
                <span className="font-medium text-foreground">
                  ₱{showtime.ticket_price}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral">Quantity:</span>
                <span className="font-medium text-foreground">
                  {bookingData.quantity}
                </span>
              </div>
              <div className="border-t border-neutral/20 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    Total Paid:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ₱{totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* DOWNLOAD */}
          <button
            onClick={handleDownloadTicket}
            disabled={isDownloading || loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            <HiArrowDownTray
              className={`h-5 w-5 ${
                isDownloading ? 'animate-pulse' : 'group-hover:animate-bounce'
              }`}
            />
            <span>{isDownloading ? 'Downloading...' : 'Download Ticket'}</span>
          </button>

          <button
            onClick={handleShareBooking}
            className="w-full bg-neutral/10 hover:bg-neutral/20 text-foreground font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            <HiShare className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Share Booking</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-transparent hover:bg-primary/5 text-primary font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-primary/20 hover:border-primary/40"
          >
            Book Another Movie
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Important:</h4>
          <ul className="text-sm text-neutral space-y-1">
            <li>• Please arrive at least 15 minutes before showtime</li>
            <li>• Keep your booking reference for entry</li>
            <li>• Download your ticket or show this confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
