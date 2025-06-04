import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Assignment} from "../models/assignment.model.js";
import dotenv from "dotenv";
dotenv.config();


const getManagerDashboard = asyncHandler(async (req, res) => {
     // Get all engineers (or filter by manager's department)
    const engineers = await User.find({ role: 'engineer' });

    const assignments = await Assignment.find();

    const data = engineers.map((engineer) => {
      const engineerAssignments = assignments.filter(
        (a) => a.engineerId.toString() === engineer._id.toString()
      );

      const totalLoad = engineerAssignments.reduce((sum, a) => sum + a.effort, 0); // e.g., effort is in %
      const utilization = (totalLoad / engineer.maxCapacity) * 100;

      return {
        id: engineer._id,
        name: engineer.name,
        skills: engineer.skills,
        department: engineer.department,
        maxCapacity: engineer.maxCapacity,
        currentLoad: totalLoad,
        utilization: utilization.toFixed(1),
        status:
          utilization >= 100
            ? 'Overloaded'
            : utilization < 50
            ? 'Underutilized'
            : 'Optimal',
      };
    });
    res.status(200).json(new ApiResponse(200,data,"Engineers Data Fetched Successfully"))
});
