import { Router } from "express";
import { login,logout,profile,register } from "./controller.js";
import { validateToken } from "../middlewares/validateToken.js";
const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', validateToken,profile)
export default router;