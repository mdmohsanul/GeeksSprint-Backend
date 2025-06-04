import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Project name must be at least 3 characters'],
      maxlength: [100, 'Project name must not exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must not exceed 1000 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    requiredSkills: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'At least one required skill must be specified',
      },
    },
    teamSize: {
      type: Number,
      required: [true, 'Team size is required'],
      min: [1, 'Team size must be at least 1'],
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed'],
      default: 'planning',
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Manager ID is required'],
    },
  },
  {
    timestamps: true, 
  }
);
export const Project = mongoose.model("Project", projectSchema);

