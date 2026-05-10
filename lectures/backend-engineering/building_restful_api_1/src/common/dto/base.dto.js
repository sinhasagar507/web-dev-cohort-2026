import Joi from "joi";

class BaseDto {
    static schema = Joi.object({}) // I don't know the fields right now, so I keep it empty. I will only inherit from it

    static validate(data){
       const {error, value} =  this.schema.validate(data, {
            abortEarly: false, // let all the errors accumulate AND stack together. We will take care of them
            stripUnknown: true // skip all the unrequired fields
        })

        if(error){
            const errors = error.details.map((d) => d.message)
            return {errors, value: null}
        }
        return {errors: null, value}
    }

}

export default BaseDto