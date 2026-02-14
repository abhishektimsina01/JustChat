import express from "express";
import { mailLogic } from "../controllers/mail.controller.js";
import { upload } from "../middleware/multer.js";

// router vhaneko hai eeuta type of mini app jastai nai ho
const mailRouter = express.Router()

// router-level
mailRouter.post("/mail", upload.array("files", 5), mailLogic)

export {mailRouter}