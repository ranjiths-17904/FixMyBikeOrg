// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username must be at most 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  mobile: {
    type: String,
    required: false, // Made optional
    unique: false, // Remove unique constraint to fix OTP verification
    trim: true,
    match: [
      /^[6-9]\d{9}$/,
      'Please enter a valid 10-digit mobile number'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['customer', 'owner'],
      message: 'Role must be either customer or owner'
    },
    default: 'customer'
  },
  profile: {
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      default: ''
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // OTP fields for email verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailOtp: {
    code: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  // OTP fields for mobile verification (if mobile is provided)
  mobileVerified: {
    type: Boolean,
    default: false
  },
  mobileOtp: {
    code: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.statics.createDefaultOwner = async function() {
  try {
    const ownerExists = await this.findOne({ role: 'owner' });
    if (!ownerExists) {
      const defaultOwner = new this({
        username: 'OwneroffixMyBike',
        email: 'owner@fixmybike.com',
        mobile: '7395860222',
        password: 'FixMyBike01',
        role: 'owner',
        profile: {
          address: '123 Service Center, Main Road',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641400'
        }
      });
      await defaultOwner.save();
      console.log('Default owner account created');
    }
  } catch (error) {
    console.error('Error creating default owner:', error);
  }
};

const User = mongoose.model('User', userSchema);

User.createDefaultOwner();

module.exports = User;
