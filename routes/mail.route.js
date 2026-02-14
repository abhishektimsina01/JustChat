import express from "express";
import { mailLogic } from "../controllers/mail.controller";

// router vhaneko hai eeuta type of mini app jastai nai ho
const mailRouter = express.Router()

// router-level
mailRouter.post("/mail", mailLogic)

export {mailRouter}