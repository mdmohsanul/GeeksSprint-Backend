import { Assignment } from "../models/assignment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private/Admin/Manager
const getAssignments = asyncHandler(async (_, res) => {
  const assignments = await Assignment.find()
    .populate('engineerId', 'name email role')
    .populate('projectId', 'name status');
    
  res.status(200).json(new ApiResponse(
    200,
    assignments,
    "Assignments fetched successfully"
  ));
});

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Admin/Manager
const createAssignment = asyncHandler(async (req, res) => {
  const {
    engineerId,
    projectId,
    allocationPercentage,
    startDate,
    endDate,
    role,
  } = req.body;

  if (!engineerId || !projectId || !allocationPercentage || !startDate || !role) {
    throw new ApiError(400,'Missing required fields');
  }

  const newAssignment = await Assignment.create({
    engineerId,
    projectId,
    allocationPercentage,
    startDate,
    endDate,
    role,
  });

  res.status(201).json(new ApiResponse(200,newAssignment,"Assignment created successfully") );
});

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Private/Admin/Manager
const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
 
  if (!assignment) {
    throw new ApiError(404,'Assignment not found');
  }

  const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
     context: 'query'
  });

  res.status(200).json(new ApiResponse(
    200,
    updated,
    "Assignment updated successfully"
  ));
});

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Admin/Manager
const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    throw new ApiError(404,'Assignment not found');
  }
   const deletedAssignment = assignment.toObject();
   await Assignment.deleteOne({ _id: req.params.id });
 
  res.status(200).json(new ApiResponse(
    200,
    deletedAssignment,
 'Assignment removed'
  ));
});

export {createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment
}