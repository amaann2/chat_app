import express from "express";
import { getUserForSideBar } from "../controller/user.controller.js";
import { protect } from "../middleware/protectRoute.js";

const router = express.Router();
router.get("/", protect, getUserForSideBar);
export default router;
