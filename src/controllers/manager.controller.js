import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Assignment} from "../models/assignment.model.js";
import dotenv from "dotenv";
dotenv.config();


const getManagerDashboard = asyncHandler(async (req, res) => {
  const engineerId = req.user._id;
  console;
  // Get engineer info
  const engineer = await User.findById(engineerId);
  if (!engineer || engineer.role !== "engineer") {
    throw new ApiError(403, "Access denied");
  }

  // Get active assignments (you may want to filter by status or endDate > now)
  const activeAssignments = await Assignment.find({ engineerId });

  // Calculate total allocated percentage
  const totalAllocated = activeAssignments.reduce((sum, a) => {
    const percent = Number(a.allocationPercentage) || 0;
    return sum + percent;
  }, 0);

  const maxCapacity = Number(engineer.maxCapacity) || 100;
  const availableCapacity = maxCapacity - totalAllocated;
  const utilization = (totalAllocated / maxCapacity) * 100;

  const response = {
    id: engineer._id,
    name: engineer.name,
    department: engineer.department,
    skills: engineer.skills,
    maxCapacity,
    currentLoad: totalAllocated,
    availableCapacity,
    utilization: utilization.toFixed(1) + "%",
    activeAssignments, // optional: to show assignment list
  };
  console.log("Manager Dashboard Response:", response);
  res
    .status(200)
    .json(new ApiResponse(200, response, "Engineer dashboard loaded"));
});

export { getManagerDashboard };