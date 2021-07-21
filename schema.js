const Joi = require('joi');

module.exports.loaderSchema = Joi.object({
    loader: Joi.object({
        company: Joi.string().required(),
        contact: Joi.string().required(),
        phone: Joi.number().required().min(7),
        email: Joi.string(),
        location: Joi.string()
    }).required()
});