const Tour = require("../models/Tour")

const getTours = async (req, res) => {
  try {
    const {
      search,
      country,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "title",
      sortOrder = "asc",
    } = req.query

    // Build query object
    const query = {}

    // Text search across multiple fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    // Country filter
    if (country) {
      query.country = { $regex: country, $options: "i" }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    // Date range filter
    if (startDate || endDate) {
      query.startDate = {}
      if (startDate) query.startDate.$gte = new Date(startDate)
      if (endDate) query.startDate.$lte = new Date(endDate)
    }

    // Build sort object
    const sortObj = {}
    const validSortFields = ["title", "price", "country", "startDate", "createdAt"]
    const sortField = validSortFields.includes(sortBy) ? sortBy : "title"
    const sortDirection = sortOrder === "desc" ? -1 : 1
    sortObj[sortField] = sortDirection

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Execute query with population and sorting
    const tours = await Tour.find(query)
      .populate("operator", "name email")
      .sort(sortObj)
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const total = await Tour.countDocuments(query)
    const totalPages = Math.ceil(total / Number.parseInt(limit))

    res.json({
      success: true,
      data: {
        page: Number.parseInt(page),
        totalPages,
        total,
        tours,
      },
    })
  } catch (err) {
    console.error("Get Tours Error:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    })
  }
}

const searchTours = async (req, res) => {
  // Use the same logic as getTours for consistency
  return getTours(req, res)
}

const createTour = async (req, res) => {
  try {
    const { title, description, country, price, startDate, endDate, operator } = req.body

    // Validation
    if (!title || !country || !price || !operator) {
      return res.status(400).json({
        success: false,
        message: "Title, country, price, and operator are required",
      })
    }

    // Create new tour
    const tour = new Tour({
      title,
      description,
      country,
      price: Number.parseFloat(price),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      operator,
    })

    const savedTour = await tour.save()

    // Populate operator info for response
    await savedTour.populate("operator", "name email")

    res.status(201).json({
      success: true,
      data: savedTour,
      message: "Tour created successfully",
    })
  } catch (err) {
    console.error("Create Tour Error:", err)

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    })
  }
}

const getTourById = async (req, res) => {
  try {
    const { id } = req.params

    const tour = await Tour.findById(id).populate("operator", "name email")

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      })
    }

    res.json({
      success: true,
      data: tour,
    })
  } catch (err) {
    console.error("Get Tour By ID Error:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    })
  }
}

const updateTour = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, country, price, startDate, endDate } = req.body

    const tour = await Tour.findById(id)

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      })
    }

    // Check if user is the owner (you might want to add this middleware)
    // if (tour.operator.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'Not authorized' });
    // }

    // Update fields
    if (title !== undefined) tour.title = title
    if (description !== undefined) tour.description = description
    if (country !== undefined) tour.country = country
    if (price !== undefined) tour.price = Number.parseFloat(price)
    if (startDate !== undefined) tour.startDate = startDate ? new Date(startDate) : undefined
    if (endDate !== undefined) tour.endDate = endDate ? new Date(endDate) : undefined

    const updatedTour = await tour.save()
    await updatedTour.populate("operator", "name email")

    res.json({
      success: true,
      data: updatedTour,
      message: "Tour updated successfully",
    })
  } catch (err) {
    console.error("Update Tour Error:", err)

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    })
  }
}

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params

    const tour = await Tour.findById(id)

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      })
    }

    // Check if user is the owner (you might want to add this middleware)
    // if (tour.operator.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'Not authorized' });
    // }

    await Tour.findByIdAndDelete(id)

    res.json({
      success: true,
      message: "Tour deleted successfully",
    })
  } catch (err) {
    console.error("Delete Tour Error:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    })
  }
}

// Get tours by operator
const getToursByOperator = async (req, res) => {
  try {
    const { operatorId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const tours = await Tour.find({ operator: operatorId })
      .populate("operator", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Tour.countDocuments({ operator: operatorId })
    const totalPages = Math.ceil(total / Number.parseInt(limit))

    res.json({
      success: true,
      data: {
        page: Number.parseInt(page),
        totalPages,
        total,
        tours,
      },
    })
  } catch (err) {
    console.error("Get Tours By Operator Error:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    })
  }
}

module.exports = {
  getTours,
  searchTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  getToursByOperator,
}
