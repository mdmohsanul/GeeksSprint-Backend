import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllEngineers,
  loginUser,
  registerUser,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import { get } from "mongoose";

const router = Router();
router
  .route("/:userId")
  .put(verifyJWT, authorizeRoles("engineer"), updateUserDetails);
router.route("/engineers").get(verifyJWT, getAllEngineers);







export default router