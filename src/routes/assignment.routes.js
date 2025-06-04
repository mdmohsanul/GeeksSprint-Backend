import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import  {createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment} from "../controllers/assignment.controller.js";

const router = Router();


router.route("/").get(
  verifyJWT,getAssignments)

router.route("/").post(
  verifyJWT,authorizeRoles('manager'),createAssignment)

router.route("/:id").put(
  verifyJWT,authorizeRoles('manager'),updateAssignment)

router.route("/:id").delete(
  verifyJWT,authorizeRoles('manager'),deleteAssignment)



export default router