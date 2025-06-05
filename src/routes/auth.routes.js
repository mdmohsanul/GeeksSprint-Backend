import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router
  .route("/logout")
  .post(verifyJWT, authorizeRoles("manager", "engineer"), logoutUser);

router.route("/currentUser").get(verifyJWT, authorizeRoles("manager", "engineer"), getCurrentUser);
export default router;