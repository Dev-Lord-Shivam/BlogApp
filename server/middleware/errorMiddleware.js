
// Unsupported (404) routes

const notFound = (req,res,next) => {
    const error = new Error(`NOT FOUND - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

// MiddleWare to handle error

const errorHandler = (error,req,res,next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500).json({message : error.message || 'An Unknown Error Has Occured'})
}

module.exports = {notFound,errorHandler};