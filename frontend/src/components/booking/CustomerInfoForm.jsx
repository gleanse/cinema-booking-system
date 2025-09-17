import { useState } from 'react';
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineChat,
} from 'react-icons/hi';

const CustomerInfoForm = ({ onCustomerInfo, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onCustomerInfo(formData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6 group"
          >
            <HiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Seat Selection</span>
          </button>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Customer Information
            </h1>
            <p className="text-neutral">
              Please provide your details for the booking confirmation
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-background rounded-xl shadow-form border border-white/10 dark:border-primary/20 p-6">
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineUser className="h-5 w-5 text-neutral" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                    errors.name
                      ? 'border-accent focus:ring-accent'
                      : 'border-inputbrdr focus:ring-primary'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-accent">{errors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="h-5 w-5 text-neutral" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                    errors.email
                      ? 'border-accent focus:ring-accent'
                      : 'border-inputbrdr focus:ring-primary'
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-accent">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlinePhone className="h-5 w-5 text-neutral" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-3 border border-inputbrdr rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Additional Comments (Optional)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <HiOutlineChat className="h-5 w-5 text-neutral" />
                </div>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows={3}
                  className="pl-10 w-full px-4 py-3 border border-inputbrdr rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="Any special requests or comments..."
                />
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-primary">
              <strong>Note:</strong> Your email is required for booking
              confirmation and ticket delivery. Phone number is optional but
              recommended for urgent updates.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            <span>Continue to Payment</span>
            <HiArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
