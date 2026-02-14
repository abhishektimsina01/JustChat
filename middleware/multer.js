// multer setup
//multer will be the middleware
import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename : (req, file, cb)=>{
        const filenameTime = Date.now()
        cb(null, file.fieldname + '-' + filenameTime + path.extname(file.originalname))
    }
})

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 3,
        files : 5
    },
    fileFilter : (req, file, cb) =>{
        if(file.mimetype.startsWith("image") || file.mimetype.startsWith("pdf")){
            cb(null, true)
        }
        else{
            cb(null, new Error("It must be either image or pdf"))
        }
    }
})


export {upload}