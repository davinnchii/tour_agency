const Tour = require('../models/Tour');

// Створення туру (тільки оператор)
exports.createTour = async (req, res) => {
  try {
    const { title, description, country, price, startDate, endDate } = req.body;

    if (req.user.role !== 'operator') {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    const tour = await Tour.create({
      title,
      description,
      country,
      price,
      startDate,
      endDate,
      operator: req.user._id,
    });

    res.status(201).json(tour);
  } catch (err) {
    console.error('Create Tour Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Отримання списку турів (пошук через query)
exports.getTours = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const skip = (page - 1) * limit;

    const tours = await Tour.find(query)
      .populate('operator', 'name email')
      .skip(skip)
      .limit(parseInt(limit));

    // Для клієнта можна також повертати загальну кількість і сторінки
    const total = await Tour.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      page: parseInt(page),
      totalPages,
      total,
      tours,
    });
  } catch (err) {
    console.error('Get Tours Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Видалення туру (тільки оператор, який створив тур)
exports.deleteTour = async (req, res) => {
  try {
    if (req.user.role !== 'operator') {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Тур не знайдено' });
    }

    if (tour.operator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    await Tour.findByIdAndDelete(req.params.id);

    res.json({ message: 'Тур видалено' });
  } catch (err) {
    console.error('Delete Tour Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

