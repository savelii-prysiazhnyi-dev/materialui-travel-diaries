import express from "express";
import { signup, login, getUserById, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getUserById);

export default router;
