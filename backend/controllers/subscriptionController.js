const User = require('../models/User');
const Subscription = require('../models/Subscription');

exports.createSubscription = async (req, res) => {
  try {
    const { operatorId } = req.body;

    if (!operatorId) {
      return res.status(400).json({ message: 'Operator ID is required' });
    }

    const user = await User.findById(req.user._id);
    const operator = await User.findById(operatorId);

    if (!user || user.role !== 'agent') {
      return res.status(403).json({ message: 'Only agents can subscribe' });
    }

    // Перевірка чи вже є підписка
    const existingSub = await Subscription.findOne({
      agency: user._id,
      operator: operatorId,
    });

    if (existingSub) {
      return res.status(400).json({ message: 'Already subscribed' });
    }

    // Створення підписки
    const subscription = new Subscription({
      agency: user._id,
      operator: operatorId,
      service: 'basic', // або req.body.service
    });

    user.subscriptions.push(subscription._id);
    await user.save();
    await subscription.save();
  
    res.status(201).json({
      message: 'Subscribed successfully',
      subscriptions: user.subscriptions,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Відписатися
exports.deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const agent = await User.findById(req.user._id);

    agent.subscriptions = agent.subscriptions.filter(
      ({_id}) => {
        return _id.toString() !== id
      }
    );


    await Subscription.findByIdAndDelete(id);

    await agent.save();
    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Отримати підписки агента
exports.getSubscriptions = async (req, res) => {
  try {
    const agent = await User.findById(req.user._id).populate({
      path: 'subscriptions',
      populate: [{ path: 'operator', select: 'name email' }, {path: 'agency', select: 'name email'}],
    });
    res.json(agent.subscriptions);
  } catch (err) {
    console.error('Get subscriptions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
