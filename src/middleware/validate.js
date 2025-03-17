import logger from "../utils/logger.js";

const formatValidationErrors = (error) => {
    const messages = error.details.map((err) => err.message.replace(/\"/g, ""));
    return messages.length === 1
        ? { message: messages[0] }
        : { message: "Validation failed", errors: messages };
};

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const { body, params, headers, query } = req;
            const result = await schema({ body, params, headers, query });

            if (result.error) {
                return res.status(400).json(formatValidationErrors(result.error));
            }

            next();
        } catch (err) {
            if (err.isJoi) {
                return res.status(400).json(formatValidationErrors(err));
            }

            logger.error("Unexpected Validation Error:", err);
            return res.status(500).json({ message: "Internal validation error" });
        }
    };
};

export default validate;
