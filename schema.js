const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.loaderSchema = Joi.object({
    loader: Joi.object({
        company: Joi.string().required().escapeHTML(),
        contact: Joi.string().required().escapeHTML(),
        phone: Joi.string().required().min(7),
        email: Joi.string().escapeHTML(),
        location: Joi.string().escapeHTML()
    }).required()
});