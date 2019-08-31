import Joi from 'joi';

function formIsValid(formData, schema) {
    const res = Joi.validate(formData, schema);

    return !res.error;
}

const categorySchema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
});

// this is used for validation of categories but not category 
// creation eg.category selects
const categoryIdSchema = Joi.object().keys({
    id: Joi.string().required(),
}).pattern(/./, Joi.any());  // allow any other keys

const artefactSchema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    categories: Joi.array().items(categoryIdSchema),
});

export {
    formIsValid,
    artefactSchema,
    categorySchema,
};