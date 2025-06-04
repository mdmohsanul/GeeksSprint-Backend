import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    engineerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Engineer ID is required"],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    allocationPercentage: {
      type: Number,
      required: [true, "Allocation percentage is required"],
      min: [1, "Allocation must be at least 1%"],
      max: [100, "Allocation cannot exceed 100%"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          let start = this.startDate;

          if (typeof this.getUpdate === "function") {
            const update = this.getUpdate();
            start = update.startDate ?? this._conditions?.startDate;
          }

          if (!start) return true;

          const startDate = new Date(start);
          const endDate = new Date(value);

          return !isNaN(startDate) && !isNaN(endDate) && endDate >= startDate;
        },
        message: "End date must be after start date",
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      enum: {
        values: [
          "Developer",
          "Tech Lead",
          "QA",
          "Project Manager",
          "UX Designer",
          "Other",
        ],
        message: "Role is not valid",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);
export const Assignment = mongoose.model("Assignment", assignmentSchema);
