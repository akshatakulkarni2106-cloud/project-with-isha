import { Router } from "express";
import { signup, login , getMe, logout} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me",authenticate, getMe);
router.post("/logout", logout);

export default router;