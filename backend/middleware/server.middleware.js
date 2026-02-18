import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import express from "express"
import {limiter} from "../config/rateLimit.js"

function server_middleware(app){
    app.use(limiter)
    app.use(morgan("dev"))
    app.use(cookieParser())
    app.use(express.json())
    app.use(express.urlencoded({extended : true}))
    app.use(cors())
}


export {server_middleware}