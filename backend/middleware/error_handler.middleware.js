

const error_handler = (err, req, res, next) => {
    const message = err.message
    const status = err.status
    res.json({
        message : message,
        status : status,
        stack : process.env.state == "development" ? err.stack : null
    })
} 

export {error_handler}