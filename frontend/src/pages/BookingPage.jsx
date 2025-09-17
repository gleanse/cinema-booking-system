import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuantitySelector from '../components/booking/QuantitySelector';
import SeatSelector from '../components/booking/SeatSelector';
import CustomerInfoForm from '../components/booking/CustomerInfoForm';
import Payment from '../components/booking/Payment';
import useShowtimeDetails from '../hooks/useShowtimeDetails';
import { HiExclamationTriangle, HiArrowLeft } from 'react-icons/hi2';

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('quantity');
  const [bookingData, setBookingData] = useState({
    quantity: 1,
    selectedSeats: [],
    customerInfo: null,
  });

  const { showtime, loading, error, refetch } = useShowtimeDetails(showtimeId);

  const steps = {
    quantity: 'quantity',
    seats: 'seats',
    customer: 'customer',
    payment: 'payment',
  };

  const handleQuantitySelected = (quantity) => {
    setBookingData((prev) => ({ ...prev, quantity }));
    setCurrentStep(steps.seats);
  };

  const handleSeatsSelected = (selectedSeats) => {
    setBookingData((prev) => ({ ...prev, selectedSeats }));
    setCurrentStep(steps.customer);
  };

  const handleCustomerInfo = (customerInfo) => {
    setBookingData((prev) => ({ ...prev, customerInfo }));
    setCurrentStep(steps.payment);
  };

  const handleBack = () => {
    if (currentStep === steps.seats) {
      setCurrentStep(steps.quantity);
    } else if (currentStep === steps.customer) {
      setCurrentStep(steps.seats);
    } else if (currentStep === steps.payment) {
      setCurrentStep(steps.customer);
    } else {
      navigate(-1);
    }
  };

  const handleBookingComplete = (paymentData) => {
    // FIXED: now receiving paymentData parameter
    // TODO: all mock change later
    navigate('/booking-confirmation', {
      state: {
        bookingData,
        showtime,
        paymentData,
      },
    });
  };

  const handleRetry = () => {
    refetch();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-neutral">Loading showtime details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6"
          >
            <HiArrowLeft className="h-5 w-5" />
            <span>Back to Cinemas</span>
          </button>

          <div className="flex items-center justify-center min-h-96">
            <div className="text-center max-w-md mx-auto">
              <div className="bg-accent/10 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <HiExclamationTriangle className="h-10 w-10 text-accent" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Oops! Something went wrong
              </h2>

              <p className="text-neutral mb-6">{error}</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>

                <button
                  onClick={handleGoBack}
                  className="bg-neutral/10 hover:bg-neutral/20 text-neutral font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="bg-accent/10 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <HiExclamationTriangle className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Showtime Not Found
              </h2>
              <p className="text-neutral mb-6">
                The requested showtime could not be found.
              </p>
              <button
                onClick={handleGoBack}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Go Back to Cinemas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentStep === steps.quantity && (
        <QuantitySelector
          showtime={showtime}
          onQuantitySelected={handleQuantitySelected}
          onBack={handleBack}
        />
      )}

      {currentStep === steps.seats && (
        <SeatSelector
          showtime={showtime}
          quantity={bookingData.quantity}
          onSeatsSelected={handleSeatsSelected}
          onBack={handleBack}
        />
      )}

      {currentStep === steps.customer && (
        <CustomerInfoForm
          onCustomerInfo={handleCustomerInfo}
          onBack={handleBack}
        />
      )}

      {currentStep === steps.payment && (
        <Payment
          bookingData={bookingData}
          showtime={showtime}
          onBookingComplete={handleBookingComplete}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default BookingPage;
