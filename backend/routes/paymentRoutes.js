const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const auth = require('../middleware/auth');
const { User, Booking } = require('../models');

// Create payment intent
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'inr', metadata = {} } = req.body;
    const { userId } = req.user;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user info to metadata
    const enhancedMetadata = {
      ...metadata,
      userId: userId,
      userEmail: user.email,
      userName: user.username || user.email
    };

    let result;
    
    if (paymentService.isStripeConfigured()) {
      // Use real Stripe payment
      result = await paymentService.createPaymentIntent(amount, currency, enhancedMetadata);
    } else {
      // Use simulated payment for development
      result = await paymentService.simulatePayment(amount, 'card', enhancedMetadata);
    }

    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
});

// Process UPI payment
router.post('/process-upi', auth, async (req, res) => {
  try {
    const { amount, upiId, metadata = {} } = req.body;
    const { userId } = req.user;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    if (!upiId) {
      return res.status(400).json({
        success: false,
        message: 'UPI ID is required'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user info to metadata
    const enhancedMetadata = {
      ...metadata,
      userId: userId,
      userEmail: user.email,
      userName: user.username || user.email
    };

    let result;
    
    if (paymentService.isStripeConfigured()) {
      // Use real Stripe UPI payment
      result = await paymentService.processUPIPayment(amount, upiId, enhancedMetadata);
    } else {
      // Use simulated UPI payment for development
      result = await paymentService.simulatePayment(amount, 'upi', {
        ...enhancedMetadata,
        upi_id: upiId
      });
    }

    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('UPI payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process UPI payment'
    });
  }
});

// Process card payment
router.post('/process-card', auth, async (req, res) => {
  try {
    const { amount, paymentMethodId, metadata = {} } = req.body;
    const { userId } = req.user;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'Payment method ID is required'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user info to metadata
    const enhancedMetadata = {
      ...metadata,
      userId: userId,
      userEmail: user.email,
      userName: user.username || user.email
    };

    let result;
    
    if (paymentService.isStripeConfigured()) {
      // Use real Stripe card payment
      result = await paymentService.processCardPayment(amount, paymentMethodId, enhancedMetadata);
    } else {
      // Use simulated card payment for development
      result = await paymentService.simulatePayment(amount, 'card', enhancedMetadata);
    }

    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Card payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process card payment'
    });
  }
});

// Confirm payment
router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const { userId } = req.user;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    let result;
    
    if (paymentService.isStripeConfigured()) {
      // Use real Stripe confirmation
      result = await paymentService.confirmPayment(paymentIntentId);
    } else {
      // For simulated payments, assume success
      result = {
        success: true,
        status: 'completed',
        amount: 0, // Will be updated from metadata
        method: 'simulated'
      };
    }

    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment'
    });
  }
});

// Get payment details
router.get('/details/:paymentIntentId', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const { userId } = req.user;

    let result;
    
    if (paymentService.isStripeConfigured()) {
      // Use real Stripe API
      result = await paymentService.getPaymentDetails(paymentIntentId);
    } else {
      // Return simulated payment details
      result = {
        success: true,
        amount: 0,
        currency: 'inr',
        status: 'succeeded',
        created: Date.now(),
        metadata: {}
      };
    }

    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment details'
    });
  }
});

// Refund payment
router.post('/refund', auth, async (req, res) => {
  try {
    const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;
    const { userId, role } = req.user;

    // Only owners can process refunds
    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can process refunds'
      });
    }

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    let result;
    
    if (paymentService.isStripeConfigured()) {
      // Use real Stripe refund
      result = await paymentService.refundPayment(paymentIntentId, amount, reason);
    } else {
      // Simulate refund
      result = {
        success: true,
        refundId: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount || 0,
        status: 'succeeded'
      };
    }

    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Payment refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund'
    });
  }
});

// Get available payment methods
router.get('/methods', auth, async (req, res) => {
  try {
    const methods = paymentService.getAvailablePaymentMethods();
    
    res.json({
      success: true,
      data: {
        methods: methods,
        isStripeConfigured: paymentService.isStripeConfigured()
      }
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment methods'
    });
  }
});

// Webhook for Stripe events (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!paymentService.isStripeConfigured()) {
    return res.status(400).json({ message: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return res.status(400).json({ message: 'Missing signature or webhook secret' });
  }

  let event;

  try {
    // Use the paymentService's stripe instance
    const stripeInstance = paymentService.stripe;
    if (!stripeInstance) {
      return res.status(400).json({ message: 'Stripe not available' });
    }
    
    event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
