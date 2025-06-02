const Request = require('../models/Request');
const Tour = require('../models/Tour');

// Перегляд списку заявок (для агента і оператора)
exports.getRequests = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'agent') {
      // агент бачить заявки своєї агенції
      filter.agency = req.user._id;
    } else if (req.user.role === 'operator') {
      // оператор бачить заявки, пов’язані з турами свого оператора
      const tours = await Tour.find({ operator: req.user._id }).select('_id');
      filter.tour = { $in: tours.map(t => t._id) };
    }

    const requests = await Request.find(filter)
      .populate('tour', 'title country price')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Get Requests Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Перегляд детальної інформації про заявку
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('tour')
      .populate('createdBy', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Заявка не знайдена' });
    }

    // Перевірка доступу
    if (req.user.role === 'agent' && request.agency?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }
    if (req.user.role === 'operator') {
      const tour = await Tour.findById(request.tour);
      if (!tour || tour.operator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Доступ заборонено' });
      }
    }

    res.json(request);
  } catch (err) {
    console.error('Get Request By ID Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Додавання заявки (для агента чи оператора)
exports.createRequest = async (req, res) => {
  try {
    const { tour, customerName, customerEmail } = req.body;

    // Перевірка, що тур існує
    const existingTour = await Tour.findById(tour);
    if (!existingTour) {
      return res.status(404).json({ message: 'Тур не знайдено' });
    }

    // Створюємо заявку
    const requestData = {
      tour,
      customerName,
      customerEmail,
      createdBy: req.user._id,
    };

    if (req.user.role === 'agent') {
      requestData.agency = req.user._id;
    } else if (req.user.role === 'operator') {
      requestData.operator = req.user._id;
    }

    const newRequest = await Request.create(requestData);
    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Create Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Видалення заявки (тільки оператор)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Заявка не знайдена' });
    }

    if (req.user.role == 'operator') {
      const tour = await Tour.findById(request.tour);
      if (!tour || tour.operator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Доступ заборонено' });
      }
    }

    if (req.user.role == 'agent') {
      if (request.agency.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Доступ заборонено' });
      }
    }

    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Заявку видалено' });
  } catch (err) {
    console.error('Delete Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
