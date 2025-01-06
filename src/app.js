// Load environment variables first
const path = require('path');
const envPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

// Debug: Log environment loading
console.log('Environment variables loaded from:', envPath);
console.log('Environment check - PORT:', process.env.PORT);

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const charityRoutes = require('./routes/charity.routes');
const donationRoutes = require('./routes/donation.routes');
const adminRoutes = require('./routes/admin.routes');
const impactRoutes = require('./routes/impact.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/impact', impactRoutes);

const PORT = process.env.PORT || 3000;

// Sync database and start server
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
