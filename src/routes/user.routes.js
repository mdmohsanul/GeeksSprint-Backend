import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes

// app.get(
//   "/dashboard/manager",
//   verifyJWT,
//   authorizeRoles("manager"),
//   getManagerDashboard
// );
// app.get(
//   "/dashboard/engineer",
//   authenticate,
//   authorizeRoles("engineer"),
//   getEngineerDashboard
// );



export default router