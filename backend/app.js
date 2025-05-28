const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const requestRoutes = require('./routes/requestRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

module.exports = app;
