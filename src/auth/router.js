import { Router } from "express";
import { login,logout,profile,register } from "./controller.js";
import { validateToken } from "../middlewares/validateToken.js";
import { sendVerificationCode,verifyCodeAndResetPassword } from "./controller.js";
const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', validateToken,profile);
router.post('/send-verification-code', sendVerificationCode);
router.post('/reset-password', verifyCodeAndResetPassword);

export default router;