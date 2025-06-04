import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import { createProject, getProjectById, getProjects } from "../controllers/project.controller.js";

const router = Router();

router.route("/").get(
  verifyJWT,getProjects)

router.route("/").post(
  verifyJWT,authorizeRoles('manager'),createProject)

router.route("/:id").get(verifyJWT,getProjectById)

export default router