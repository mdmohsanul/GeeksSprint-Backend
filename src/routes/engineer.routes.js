import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllEngineers,

} from "../controllers/user.controller.js";



const router = Router();


router.route("/").get(verifyJWT, getAllEngineers);

export default router;