import express from "express";
import { fetchRoomId } from "../controllers/chat.controller.js";
import {uploadFile} from "../controllers/chat.controller.js"
import { upload } from "../middleware/multer.js";

const chatRouter = express.Router()

chatRouter.get("/fetchRoom/:roomId", fetchRoomId)
chatRouter.post("/uploadFile", upload.array("files", 4), uploadFile)

export {chatRouter}