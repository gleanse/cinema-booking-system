import { useState, useMemo } from 'react';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';

const SeatSelector = ({ showtime, quantity, onSeatsSelected, onBack }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatsData = useMemo(() => {
    if (!showtime?.seats_data) return [];

    const seats = Object.entries(showtime.seats_data).map(
      ([seatId, seatInfo]) => ({
        id: seatId,
        available: seatInfo.available,
        row: seatId.charAt(0),
        number: parseInt(seatId.slice(1)),
      })
    );

    return seats.sort((a, b) => {
      if (a.row === b.row) {
        return a.number - b.number;
      }
      return a.row.localeCompare(b.row);
    });
  }, [showtime?.seats_data]);

  const seatsByRow = useMemo(() => {
    const grouped = {};
    seatsData.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      grouped[seat.row].push(seat);
    });
    return grouped;
  }, [seatsData]);

  const handleSeatSelect = (seatId) => {
    const seat = seatsData.find((s) => s.id === seatId);

    if (!seat?.available) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else if (selectedSeats.length < quantity) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === quantity) {
      onSeatsSelected(selectedSeats);
    }
  };

  const getSeatButtonClass = (seat) => {
    const baseClass =
      'w-10 h-10 rounded-lg border-2 text-xs font-semibold transition-all duration-200';

    if (!seat.available) {
      return `${baseClass} bg-red-100 border-red-300 text-red-500 cursor-not-allowed opacity-50`;
    }

    if (selectedSeats.includes(seat.id)) {
      return `${baseClass} bg-primary border-primary text-white transform scale-105`;
    }

    if (selectedSeats.length >= quantity) {
      return `${baseClass} bg-background border-neutral/20 text-neutral opacity-50 cursor-not-allowed`;
    }

    return `${baseClass} bg-background border-neutral/20 text-foreground hover:border-primary hover:bg-primary/10 cursor-pointer`;
  };

  const rowLabels = Object.keys(seatsByRow).sort();
  const maxSeatsInRow = Math.max(
    ...Object.values(seatsByRow).map((row) => row.length)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6 group"
          >
            <HiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Quantity</span>
          </button>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Select Your Seats
            </h1>
            <p className="text-neutral">
              Choose {quantity} seat{quantity > 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-foreground">
                {showtime.movie.title}
              </span>
            </p>
            <div className="mt-4 text-sm">
              <p className="text-neutral">
                <span className="font-semibold">
                  {showtime.room.cinema_name}
                </span>{' '}
                - {showtime.room.name}
              </p>
            </div>
          </div>
        </div>

        {/* SEAT SELECTION */}
        <div className="bg-background rounded-xl shadow-form border border-white/10 dark:border-primary/20 p-6 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Screen
            </h2>
            <div className="bg-gradient-to-t from-primary/30 to-primary/10 h-3 rounded-lg mb-2 mx-auto max-w-2xl"></div>
            <div className="bg-gradient-to-t from-primary/20 to-primary/5 h-1 rounded-lg mx-auto max-w-xl"></div>
          </div>

          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-background border-2 border-neutral/20 rounded"></div>
              <span className="text-neutral">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-neutral">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-neutral">Occupied</span>
            </div>
          </div>

          {/* SEAT MAP */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {rowLabels.map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-center gap-2 mb-3"
                >
                  {/* ROW LABEL LEFT */}
                  <div className="w-8 text-center font-semibold text-neutral text-sm">
                    {row}
                  </div>

                  {/* SEATS IN ROW */}
                  <div className="flex gap-1">
                    {seatsByRow[row].map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatSelect(seat.id)}
                        disabled={
                          !seat.available ||
                          (selectedSeats.length >= quantity &&
                            !selectedSeats.includes(seat.id))
                        }
                        className={getSeatButtonClass(seat)}
                        title={`Seat ${seat.id} - ${
                          seat.available ? 'Available' : 'Occupied'
                        }`}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>

                  {/* RIGHT ROW LABEL */}
                  <div className="w-8 text-center font-semibold text-neutral text-sm">
                    {row}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="border-t border-neutral/20 pt-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-neutral block mb-1">Selected seats:</span>
                <p className="font-semibold text-foreground">
                  {selectedSeats.length > 0
                    ? selectedSeats.sort().join(', ')
                    : 'None selected'}
                </p>
                <p className="text-sm text-neutral mt-1">
                  {selectedSeats.length} of {quantity} selected
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-neutral block mb-1">Total amount:</span>
                <p className="text-2xl font-bold text-primary">
                  ₱{(showtime.ticket_price * quantity).toFixed(2)}
                </p>
                <p className="text-sm text-neutral">
                  {quantity} × ₱{showtime.ticket_price} each
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedSeats.length !== quantity}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-neutral/20 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <span>
            {selectedSeats.length === quantity
              ? `Continue with ${selectedSeats.sort().join(', ')}`
              : `Select ${quantity - selectedSeats.length} more seat${
                  quantity - selectedSeats.length > 1 ? 's' : ''
                }`}
          </span>
          {selectedSeats.length === quantity && (
            <HiArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;
