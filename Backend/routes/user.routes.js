import express from "express";
import { createUser, getUser } from "../controller/user.controller.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/get", getUser);

export default router;