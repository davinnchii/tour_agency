const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    startDate: {
      type: Date,
      validate: {
        validator: (value) => {
          // Only validate if startDate is provided
          return !value || value >= new Date()
        },
        message: "Start date must be in the future",
      },
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // Only validate if both dates are provided
          return !value || !this.startDate || value > this.startDate
        },
        message: "End date must be after start date",
      },
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Operator is required"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better search performance
tourSchema.index({ title: "text", description: "text", country: "text" })
tourSchema.index({ country: 1 })
tourSchema.index({ price: 1 })
tourSchema.index({ startDate: 1 })
tourSchema.index({ operator: 1 })

module.exports = mongoose.model("Tour", tourSchema)
