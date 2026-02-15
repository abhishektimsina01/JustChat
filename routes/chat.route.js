import express from "express";
import { fetchRoomId } from "../controllers/chat.controller.js";

const chatRouter = express.Router()

chatRouter.get("/fetchRoom/:roomId", fetchRoomId)

export {chatRouter}