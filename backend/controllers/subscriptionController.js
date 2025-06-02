const User = require('../models/User');

exports.createSubscription = async (req, res) => {
  const { destination, price, operatorId } = req.body;

  if (!operatorId) {
    return res.status(400).json({ message: 'Operator ID is required' });
  }

  const user = await User.findById(req.user._id);

  if (!user || user.role !== 'agent') {
    return res.status(403).json({ message: 'Only agents can subscribe' });
  }

  console.log(user);


  if (user.subscriptions.find((value) => value.operatorId.toString() === operatorId)) {
    return res.status(400).json({ message: 'Already subscribed' });
  }

  user.subscriptions.push({operatorId, destination, price });
  await user.save();

  res.status(201).json({ message: 'Subscribed successfully', subscriptions: user.subscriptions });
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
    const agent = await User.findById(req.user._id).populate('subscriptions', 'name email');
    res.json(agent.subscriptions);
  } catch (err) {
    console.error('Get subscriptions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
