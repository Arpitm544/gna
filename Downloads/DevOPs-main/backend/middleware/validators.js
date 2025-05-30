const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Name is required'),
        body('phone').isMobilePhone().withMessage('Valid phone number is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('type').isIn([0, 1]).withMessage('Type must be either 0 (Client) or 1 (Performer)')
    ];
};

const bookingValidationRules = () => {
    return [
        body('performerId').notEmpty(),
        body('date').isISO8601(),
        body('location').notEmpty()
    ];
};

const performerValidationRules = () => {
    return [
        body('category').isIn(Object.values(PerformerCategoryEnum)),
        body('subCategory').isIn(Object.values(PerformerSubCategoryEnum)),
        body('description').isLength({ min: 10, max: 1000 }),
        body('price').isNumeric(),
        body('availability').isArray(),
        body('location').notEmpty()
    ];
};


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const userUpdateValidationRules = () => {
    return [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
        body('type').optional().isIn([0, 1]).withMessage('Type must be either 0 (Client) or 1 (Performer)')
        // Note: We exclude password updates from here, which you're already doing in controller
    ];
};

module.exports = {
    userValidationRules,
    bookingValidationRules,
    userUpdateValidationRules, 
    performerValidationRules,
    validate
};
