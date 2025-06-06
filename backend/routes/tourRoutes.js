const express = require("express")
const router = express.Router()
const {
  getTours,
  searchTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  getToursByOperator,
} = require("../controllers/tourController")

// Public routes
router.get("/", getTours)
router.get("/search", searchTours) // Dedicated search endpoint
router.get("/operator/:operatorId", getToursByOperator)
router.get("/:id", getTourById)

// Protected routes (you might want to add authentication middleware)
router.post("/", createTour)
router.patch("/:id", updateTour)
router.delete("/:id", deleteTour)

module.exports = router
