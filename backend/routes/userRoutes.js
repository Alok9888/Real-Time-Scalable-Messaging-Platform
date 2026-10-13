import express from "express";
import { register, login, logout, getOtherUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/other-users").get(isAuthenticated, getOtherUser);


export default router;

