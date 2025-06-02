const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Tour = require('./models/Tour');
const Request = require('./models/Request');

async function seedData() {
  try {
    const usersCount = await User.countDocuments();
    if (usersCount > 0) {
      console.log('Seed data already exists, skipping...');
      return;
    }

    // 🔐 Статичне хешування пароля '123456'
    const staticHash = bcrypt.hashSync('123456', 10);

    const operator = await User.create({
      name: 'Operator One',
      email: 'operator@example.com',
      password: "123456",
      role: 'operator'
    });

    const agent = await User.create({
      name: 'Agent One',
      email: 'agent@example.com',
      password: '123456',
      role: 'agent',
      subscriptions: []
    });

    const tour1 = await Tour.create({
      title: 'Круїз по Середземному морю',
      description: '10 днів незабутньої подорожі',
      country: 'Іспанія',
      price: 1200,
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-07-10'),
      operator: operator._id
    });

    const tour2 = await Tour.create({
      title: 'Гірськолижний тур до Альп',
      description: '7 днів активного відпочинку',
      country: 'Швейцарія',
      price: 1500,
      startDate: new Date('2025-12-15'),
      endDate: new Date('2025-12-22'),
      operator: operator._id
    });

    await Request.create({
      tour: tour1._id,
      customerName: 'Іван Іванов',
      customerEmail: 'ivan@example.com',
      status: 'pending',
      createdBy: agent._id,
      agency: agent._id
    });

    await Request.create({
      tour: tour2._id,
      customerName: 'Олена Петрівна',
      customerEmail: 'olena@example.com',
      status: 'pending',
      createdBy: operator._id,
      operator: operator._id
    });

    console.log('✅ Seed data created successfully');
  } catch (err) {
    console.error('❌ Seed data error:', err);
  }
}

module.exports = seedData;
