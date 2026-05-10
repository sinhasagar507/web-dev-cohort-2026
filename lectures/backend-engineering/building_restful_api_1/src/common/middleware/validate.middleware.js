import ApiError from "../utils/api-error.js";

const validate = (Dtoclass) => {
    return (req, res, next) => {
        const {errors, value} = Dtoclass.validate(req.body)
        if(errors){
            throw ApiError.badRequest(errors.join("; "))
        }
        req.body = value // jo data return hoke aayi whi aage bhejunga naa...aur nahi toh kya re...sanitized data hi aage bhejo
        next()
    }
}


export default validate