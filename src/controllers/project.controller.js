import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().populate('managerId', 'name email role');
  res.status(200).json(new ApiResponse(
    200,
    projects,
    "Projects fetched successfully"
  ));
});

const createProject = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    startDate,
    endDate,
    requiredSkills,
    teamSize,
    status,
    managerId,
  } = req.body;

  if (!name || !description || !managerId) {
    throw new ApiError(400, 'Missing required fields');
  }

  const newProject = await Project.create({
    name,
    description,
    startDate,
    endDate,
    requiredSkills,
    teamSize,
    status,
    managerId
  });

  res.status(201).json(new ApiResponse(
    201,
    newProject,
    "Project created successfully"
  ));
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('managerId', 'name email');

  if (!project) {
   
    throw new ApiError(404, 'Project not found');
  }

  res.status(200).json(new ApiResponse(
    200,
    project,
    "Project fetched successfully"
  ));
});

export {
  getProjects,
  createProject,
  getProjectById
};
 