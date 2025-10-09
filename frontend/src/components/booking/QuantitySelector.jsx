import { useState, useEffect } from 'react';
import {
  HiPlus,
  HiMinus,
  HiArrowRight,
  HiArrowLeft,
  HiCalendarDays,
  HiClock,
  HiMapPin,
  HiFilm,
} from 'react-icons/hi2';

const QuantitySelector = ({ showtime, onQuantitySelected, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const availableSeats = showtime?.available_seats || 0;
  const maxTickets = Math.min(availableSeats, 10);

  // reset quantity if it exceeds new maxTickets
  useEffect(() => {
    if (quantity > maxTickets) {
      setQuantity(Math.max(1, maxTickets));
    }
  }, [maxTickets, quantity]);

  const handleIncrement = () => {
    if (quantity < maxTickets) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleContinue = () => {
    onQuantitySelected(quantity);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6 group"
        >
          <HiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Showtimes</span>
        </button>

        <div className="bg-background rounded-2xl shadow-xl border border-neutral/10 dark:border-primary/20 overflow-hidden">
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
                    <HiFilm className="h-6 w-6 text-neutral/40" />
                  </div>
                )}
              </div>

              <div className="flex-grow min-w-0">
                <h1 className="text-xl font-bold text-foreground mb-2 truncate">
                  {showtime.movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                    {showtime.movie.genre_detail.name}
                  </span>
                  <span className="bg-neutral/20 text-foreground px-2 py-1 rounded text-xs font-medium">
                    {showtime.movie.age_rating}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral">
                  <div className="flex items-center gap-1">
                    <HiCalendarDays className="h-3 w-3" />
                    <span>{formatDate(showtime.show_date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiClock className="h-3 w-3" />
                    <span>{formatTime(showtime.show_time)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiMapPin className="h-3 w-3" />
                    <span>{showtime.room.cinema_name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Select Ticket Quantity
              </h2>
              <p className="text-neutral">How many tickets do you need?</p>
            </div>

            {/* QUANTITY CONTROL */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1 || availableSeats === 0}
                className="w-12 h-12 bg-primary/10 hover:bg-primary/20 disabled:bg-neutral/10 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200 group"
              >
                <HiMinus className="h-5 w-5 text-primary group-disabled:text-neutral/50" />
              </button>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl px-6 py-4 border border-primary/20">
                <div className="text-4xl font-bold text-foreground text-center min-w-[60px]">
                  {quantity}
                </div>
              </div>

              <button
                onClick={handleIncrement}
                disabled={quantity >= maxTickets || availableSeats === 0}
                className="w-12 h-12 bg-primary/10 hover:bg-primary/20 disabled:bg-neutral/10 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200 group"
              >
                <HiPlus className="h-5 w-5 text-primary group-disabled:text-neutral/50" />
              </button>
            </div>

            <p className="text-center text-sm text-neutral mb-6">
              {availableSeats > 0 ? (
                <>
                  Maximum {maxTickets} tickets per booking • {availableSeats}{' '}
                  seats available
                </>
              ) : (
                'No seats available for this showtime'
              )}
            </p>

            <div className="bg-gradient-to-r from-neutral/5 to-neutral/10 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <p className="text-sm text-neutral">Price per ticket</p>
                  <p className="text-lg font-semibold text-foreground">
                    ₱{showtime.ticket_price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral">Total amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ₱{(showtime.ticket_price * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="border-t border-neutral/20 mt-3 pt-3 text-center">
                <p className="text-sm text-neutral">
                  {quantity} {quantity === 1 ? 'ticket' : 'tickets'} × ₱
                  {showtime.ticket_price}
                </p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={availableSeats === 0}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-neutral/30 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>
                {availableSeats === 0
                  ? 'No Seats Available'
                  : 'Continue to Seat Selection'}
              </span>
              {availableSeats > 0 && (
                <HiArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
