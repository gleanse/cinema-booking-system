import { useState } from 'react';
import {
  HiArrowLeft,
  HiCheck,
  HiCreditCard,
  HiLockClosed,
} from 'react-icons/hi2';

const Payment = ({ bookingData, showtime, onBookingComplete, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // generate MOCK payment data and pass it to onbookingcomplete
      const mockPaymentData = {
        paymentReference: `mock_pay_${Date.now()}`,
        paymentGateway: 'mock',
      };

      onBookingComplete(mockPaymentData);
    }, 2000);
  };

  const totalAmount = showtime.ticket_price * bookingData.quantity;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6 group"
          >
            <HiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Customer Info</span>
          </button>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Payment
            </h1>
            <p className="text-neutral">
              Complete your booking with secure payment
            </p>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-form border border-white/10 dark:border-primary/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Booking Summary
          </h2>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-neutral">Movie:</span>
              <span className="font-medium text-foreground">
                {showtime.movie.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral">Showtime:</span>
              <span className="font-medium text-foreground">
                {new Date(showtime.show_date).toLocaleDateString()} at{' '}
                {showtime.show_time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral">Seats:</span>
              <span className="font-medium text-foreground">
                {bookingData.selectedSeats.join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral">Tickets:</span>
              <span className="font-medium text-foreground">
                {bookingData.quantity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral">Price per ticket:</span>
              <span className="font-medium text-foreground">
                ₱{showtime.ticket_price}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral/20 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-foreground">
                Total:
              </span>
              <span className="text-2xl font-bold text-primary">
                ₱{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-form border border-white/10 dark:border-primary/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Payment Method
          </h2>

          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 border-primary rounded-lg cursor-pointer hover:bg-primary/5 transition-colors duration-200">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary'
                    : 'border-neutral/30'
                }`}
              >
                {paymentMethod === 'card' && (
                  <HiCheck className="h-3 w-3 text-white" />
                )}
              </div>
              <div className="flex items-center">
                <HiCreditCard className="h-6 w-6 text-primary mr-2" />
                <span className="font-medium text-foreground">
                  Credit/Debit Card
                </span>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-inputbrdr rounded-lg cursor-pointer hover:bg-primary/5 transition-colors duration-200">
              <input
                type="radio"
                name="paymentMethod"
                value="paymaya"
                checked={paymentMethod === 'paymaya'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 'paymaya'
                    ? 'border-primary bg-primary'
                    : 'border-neutral/30'
                }`}
              >
                {paymentMethod === 'paymaya' && (
                  <HiCheck className="h-3 w-3 text-white" />
                )}
              </div>
              <span className="font-medium text-foreground">PayMaya</span>
            </label>

            <label className="flex items-center p-4 border-2 border-inputbrdr rounded-lg cursor-pointer hover:bg-primary/5 transition-colors duration-200">
              <input
                type="radio"
                name="paymentMethod"
                value="gcash"
                checked={paymentMethod === 'gcash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 'gcash'
                    ? 'border-primary bg-primary'
                    : 'border-neutral/30'
                }`}
              >
                {paymentMethod === 'gcash' && (
                  <HiCheck className="h-3 w-3 text-white" />
                )}
              </div>
              <span className="font-medium text-foreground">GCash</span>
            </label>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <HiLockClosed className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold text-primary">Secure Payment</span>
          </div>
          <p className="text-sm text-primary">
            Your payment information is encrypted and secure. We do not store
            your credit card details.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <span>Pay ₱{totalAmount.toFixed(2)}</span>
              <HiLockClosed className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
