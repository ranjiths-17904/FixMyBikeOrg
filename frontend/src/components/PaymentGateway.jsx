import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Shield, CheckCircle, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentGateway = ({ 
  amount, 
  bookingId, 
  customerName, 
  serviceName, 
  onPaymentSuccess, 
  onPaymentFailure,
  onClose 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, MasterCard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: DollarSign,
      description: 'Pay ₹' + amount + ' when service is completed'
    }
  ];

  const validateCardDetails = () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      toast.error('Please fill in all card details');
      return false;
    }
    
    if (cardDetails.number.length < 16) {
      toast.error('Please enter a valid card number');
      return false;
    }
    
    if (cardDetails.cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  const validateUPI = () => {
    if (!upiId) {
      toast.error('Please enter UPI ID');
      return false;
    }
    
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
    if (!upiRegex.test(upiId)) {
      toast.error('Please enter a valid UPI ID (e.g., username@upi)');
      return false;
    }
    
    return true;
  };

  const processCardPayment = async () => {
    if (!validateCardDetails()) return;
    
    setLoading(true);
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would call Stripe API
      const paymentResult = {
        success: true,
        paymentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        method: 'card',
        timestamp: new Date().toISOString()
      };
      
      setPaymentStatus('success');
      onPaymentSuccess(paymentResult);
      toast.success('Payment successful!');
      
    } catch (error) {
      setPaymentStatus('failed');
      onPaymentFailure(error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processUPIPayment = async () => {
    if (!validateUPI()) return;
    
    setLoading(true);
    try {
      // Simulate UPI payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const paymentResult = {
        success: true,
        paymentId: `upi_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        method: 'upi',
        upiId: upiId,
        timestamp: new Date().toISOString()
      };
      
      setPaymentStatus('success');
      onPaymentSuccess(paymentResult);
      toast.success('UPI payment successful!');
      
    } catch (error) {
      setPaymentStatus('failed');
      onPaymentFailure(error);
      toast.error('UPI payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processCashOnDelivery = async () => {
    setLoading(true);
    try {
      // Simulate COD processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paymentResult = {
        success: true,
        paymentId: `cod_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        method: 'cod',
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      setPaymentStatus('success');
      onPaymentSuccess(paymentResult);
      toast.success('Cash on Delivery selected! Pay ₹' + amount + ' when service is completed.');
      
    } catch (error) {
      setPaymentStatus('failed');
      onPaymentFailure(error);
      toast.error('Failed to process Cash on Delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      processCardPayment();
    } else if (paymentMethod === 'upi') {
      processUPIPayment();
    } else if (paymentMethod === 'cod') {
      processCashOnDelivery();
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your payment of {formatAmount(amount)} has been processed successfully.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
          <p className="text-gray-600 mb-6">
            There was an issue processing your payment. Please try again.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setPaymentStatus('pending')}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">{bookingId}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-green-600">
              <span>Total Amount:</span>
              <span>{formatAmount(amount)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Choose Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    paymentMethod === method.id ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <method.icon className={`w-5 h-5 ${
                      paymentMethod === method.id ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\s/g, '')})}
                maxLength="16"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  maxLength="5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  maxLength="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              placeholder="username@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your UPI ID (e.g., username@okicici, username@paytm)
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Secure Payment</p>
              <p>Your payment information is encrypted and secure. We never store your card details.</p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <span>Pay {formatAmount(amount)}</span>
            </>
          )}
        </button>

        {/* Payment Icons */}
        <div className="flex justify-center items-center space-x-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500">Secure payments by</div>
          <div className="flex space-x-2">
            <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">VISA</div>
            <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">MC</div>
            <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">UPI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
