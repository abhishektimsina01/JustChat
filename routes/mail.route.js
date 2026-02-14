import express from "express";
import { mailLogic } from "../controllers/mail.controller";
import { upload } from "../middleware/multer";

// router vhaneko hai eeuta type of mini app jastai nai ho
const mailRouter = express.Router()

// router-level
mailRouter.post("/mail", upload(), mailLogic)

export {mailRouter}