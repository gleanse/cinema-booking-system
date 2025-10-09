import { useState } from 'react';
import {
  HiArrowLeft,
  HiCheck,
  HiCreditCard,
  HiLockClosed,
} from 'react-icons/hi2';
import { FaSpinner } from 'react-icons/fa';
import useBookingsCRUD from '../../hooks/useBookingsCRUD';

const Payment = ({ bookingData, showtime, onBookingComplete, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { createBooking } = useBookingsCRUD();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const bookingPayload = {
        showtime: showtime.id,
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone,
        seats: bookingData.selectedSeats,
        number_of_tickets: bookingData.selectedSeats.length,
        customer_comments: bookingData.specialRequests || '',
        payment_method: paymentMethod,
      };

      // create booking - automatically processed as paid
      const response = await createBooking(bookingPayload);

      setIsProcessing(false);
      onBookingComplete(response);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
      throw error;
    }
  };

  const totalAmount = showtime.ticket_price * bookingData.selectedSeats.length;

  // payment method configurations
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      icon: HiCreditCard,
      description: 'Visa, Mastercard, JCB, UnionPay',
      color: 'from-primary to-secondary',
      bgColor: 'primary',
    },
    {
      id: 'gcash',
      name: 'GCash',
      description: 'Pay with your GCash wallet',
      color: 'from-blue-600 to-blue-500',
      bgColor: 'blue',
      logo: 'GCash',
    },
    {
      id: 'paymaya',
      name: 'Maya',
      description: 'Pay with your Maya wallet',
      color: 'from-green-600 to-green-500',
      bgColor: 'green',
      logo: 'Maya',
    },
  ];

  const PaymentMethodCard = ({ method }) => {
    const IconComponent = method.icon;
    const isSelected = paymentMethod === method.id;

    return (
      <label
        className={`block cursor-pointer group ${
          isSelected ? 'scale-[1.02]' : ''
        } transition-all duration-200`}
      >
        <input
          type="radio"
          name="paymentMethod"
          value={method.id}
          checked={isSelected}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="sr-only"
        />
        <div
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
            isSelected
              ? 'border-primary bg-primary/10 shadow-lg'
              : 'border-inputbrdr bg-inputbg hover:border-primary/50 hover:bg-primary/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center text-white font-semibold shadow-md`}
              >
                {IconComponent ? (
                  <IconComponent className="h-6 w-6" />
                ) : (
                  <span className="text-sm font-bold">{method.logo}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-semibold ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {method.name}
                  </span>
                  {method.id === 'credit_card' && (
                    <div className="flex space-x-1">
                      <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">
                          V
                        </span>
                      </div>
                      <div className="w-6 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">
                          M
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-neutral mt-1">
                  {method.description}
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected
                  ? 'border-primary bg-primary'
                  : 'border-neutral/30 group-hover:border-primary'
              }`}
            >
              {isSelected && <HiCheck className="h-3 w-3 text-white" />}
            </div>
          </div>

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute -inset-1 rounded-xl border-2 border-primary/30 pointer-events-none"></div>
          )}
        </div>
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6 group"
          >
            <HiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Customer Info</span>
          </button>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Complete Payment
                </h1>
                <p className="text-neutral">
                  Select your preferred payment option to finalize booking
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2 bg-primary/10 px-3 py-2 rounded-lg">
                <HiLockClosed className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Protected
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-background rounded-2xl shadow-form-s border border-inputbrdr p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              Booking Summary
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2">
                <span className="text-neutral">Movie:</span>
                <span className="font-medium text-foreground text-right">
                  {showtime.movie.title}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral">Showtime:</span>
                <span className="font-medium text-foreground text-right">
                  {new Date(showtime.show_date).toLocaleDateString()} at{' '}
                  {showtime.show_time}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral">Seats:</span>
                <span className="font-medium text-foreground text-right">
                  {bookingData.selectedSeats.join(', ')}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral">Tickets:</span>
                <span className="font-medium text-foreground">
                  {bookingData.selectedSeats.length}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral">Price per ticket:</span>
                <span className="font-medium text-foreground">
                  ₱{showtime.ticket_price}
                </span>
              </div>
            </div>

            <div className="border-t border-neutral/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-primary">
                  ₱{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-background rounded-2xl shadow-form-s border border-inputbrdr p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              Choose Payment Method
            </h2>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <PaymentMethodCard key={method.id} method={method} />
              ))}
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            {isProcessing ? (
              <>
                <FaSpinner className="h-5 w-5 animate-spin" />
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
    </div>
  );
};

export default Payment;
