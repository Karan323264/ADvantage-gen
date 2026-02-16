/**
 * auth routes:
 * Routes exposes register and login api for user registration and Login
 */
import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;