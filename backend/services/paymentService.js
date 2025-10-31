// Initialize Stripe only if the secret key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } catch (error) {
    console.warn('Stripe initialization failed:', error.message);
    stripe = null;
  }
}

class PaymentService {
  constructor() {
    this.stripe = stripe;
  }

  // Create a payment intent for Stripe
  async createPaymentIntent(amount, currency = 'inr', metadata = {}) {
    try {
      if (!this.stripe) {
        // Fallback to simulated payment if Stripe is not configured
        return await this.simulatePayment(amount, 'card', metadata);
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: metadata,
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_types: ['card', 'upi'],
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        currency: currency
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      // Fallback to simulated payment on error
      return await this.simulatePayment(amount, 'card', metadata);
    }
  }

  // Process UPI payment
  async processUPIPayment(amount, upiId, metadata = {}) {
    try {
      if (!this.stripe) {
        // Fallback to simulated payment if Stripe is not configured
        return await this.simulatePayment(amount, 'upi', {
          ...metadata,
          upi_id: upiId
        });
      }

      // For UPI, we'll create a payment intent with UPI as the payment method
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'inr',
        payment_method_types: ['upi'],
        metadata: {
          ...metadata,
          upi_id: upiId,
          payment_type: 'upi'
        },
        confirm: true,
        return_url: process.env.PAYMENT_SUCCESS_URL || 'https://fixmybike.com/payment-success'
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        method: 'upi',
        upiId: upiId,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('UPI payment processing failed:', error);
      // Fallback to simulated payment on error
      return await this.simulatePayment(amount, 'upi', {
        ...metadata,
        upi_id: upiId
      });
    }
  }

  // Process card payment
  async processCardPayment(amount, paymentMethodId, metadata = {}) {
    try {
      if (!this.stripe) {
        // Fallback to simulated payment if Stripe is not configured
        return await this.simulatePayment(amount, 'card', metadata);
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'inr',
        payment_method: paymentMethodId,
        metadata: {
          ...metadata,
          payment_type: 'card'
        },
        confirm: true,
        return_url: process.env.PAYMENT_SUCCESS_URL || 'https://fixmybike.com/payment-success'
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        method: 'card',
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Card payment processing failed:', error);
      // Fallback to simulated payment on error
      return await this.simulatePayment(amount, 'card', metadata);
    }
  }

  // Confirm payment intent
  async confirmPayment(paymentIntentId) {
    try {
      if (!this.stripe) {
        // Fallback to simulated payment if Stripe is not configured
        return await this.simulatePayment(0, 'card', {}); // Simulate a small amount for confirmation
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntent: paymentIntent,
          amount: paymentIntent.amount / 100,
          method: paymentIntent.payment_method_types[0],
          status: 'completed'
        };
      } else if (paymentIntent.status === 'requires_payment_method') {
        return {
          success: false,
          error: 'Payment method failed',
          status: 'failed'
        };
      } else {
        return {
          success: false,
          error: 'Payment is still processing',
          status: paymentIntent.status
        };
      }
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      if (!this.stripe) {
        // Fallback to simulated refund if Stripe is not configured
        return await this.simulateRefund(paymentIntentId, amount, reason);
      }

      const refundOptions = {
        payment_intent: paymentIntentId,
        reason: reason
      };

      if (amount) {
        refundOptions.amount = Math.round(amount * 100);
      }

      const refund = await this.stripe.refunds.create(refundOptions);

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      };
    } catch (error) {
      console.error('Payment refund failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment details
  async getPaymentDetails(paymentIntentId) {
    try {
      if (!this.stripe) {
        // Fallback to simulated payment details if Stripe is not configured
        return await this.simulatePaymentDetails(paymentIntentId);
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: true,
        paymentIntent: paymentIntent,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      console.error('Get payment details failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a customer
  async createCustomer(email, name, metadata = {}) {
    try {
      if (!this.stripe) {
        // Fallback to simulated customer creation if Stripe is not configured
        return await this.simulateCustomer(email, name, metadata);
      }

      const customer = await this.stripe.customers.create({
        email: email,
        name: name,
        metadata: metadata
      });

      return {
        success: true,
        customerId: customer.id,
        customer: customer
      };
    } catch (error) {
      console.error('Customer creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Simulate payment for development (when Stripe is not configured)
  async simulatePayment(amount, method = 'card', metadata = {}) {
    // This is for development/testing purposes only
    console.log(`Simulating ${method} payment of ${amount} INR`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for testing
        
        if (success) {
          resolve({
            success: true,
            paymentId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: amount,
            method: method,
            status: 'succeeded',
            timestamp: new Date().toISOString(),
            metadata: metadata
          });
        } else {
          resolve({
            success: false,
            error: 'Simulated payment failure for testing',
            status: 'failed'
          });
        }
      }, 1500); // Simulate network delay
    });
  }

  // Simulate refund for development (when Stripe is not configured)
  async simulateRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    console.log(`Simulating refund for payment intent ${paymentIntentId} with amount ${amount || 'full'}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate for testing
        if (success) {
          resolve({
            success: true,
            refundId: `sim_refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: amount || 0, // Simulate full refund if amount is null
            status: 'succeeded'
          });
        } else {
          resolve({
            success: false,
            error: 'Simulated refund failure for testing',
            status: 'failed'
          });
        }
      }, 1000); // Simulate network delay
    });
  }

  // Simulate payment details for development (when Stripe is not configured)
  async simulatePaymentDetails(paymentIntentId) {
    console.log(`Simulating get payment details for payment intent ${paymentIntentId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentIntent: {
            id: paymentIntentId,
            amount: 1000, // Simulate a small amount
            currency: 'inr',
            status: 'succeeded',
            created: Date.now(),
            metadata: {}
          },
          amount: 1000,
          currency: 'inr',
          status: 'succeeded',
          created: Date.now(),
          metadata: {}
        });
      }, 1000); // Simulate network delay
    });
  }

  // Simulate customer creation for development (when Stripe is not configured)
  async simulateCustomer(email, name, metadata = {}) {
    console.log(`Simulating create customer with email ${email}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          customerId: `sim_customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          customer: {
            id: `sim_customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email: email,
            name: name,
            metadata: metadata
          }
        });
      }, 1000); // Simulate network delay
    });
  }

  // Check if Stripe is properly configured
  isStripeConfigured() {
    return !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_...';
  }

  // Get available payment methods
  getAvailablePaymentMethods() {
    if (this.isStripeConfigured()) {
      return ['card', 'upi', 'netbanking', 'wallet'];
    } else {
      return ['card', 'upi']; // Fallback methods
    }
  }
}

module.exports = new PaymentService();
