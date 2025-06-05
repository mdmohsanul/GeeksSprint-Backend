import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllEngineers,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";


const router = Router();
router
  .route("/:userId")
  .put(verifyJWT, authorizeRoles("engineer"), updateUserDetails);








export default router