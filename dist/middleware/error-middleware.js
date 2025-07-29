"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const response_error_1 = require("../error/response-error");
const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }
    if (err instanceof response_error_1.ResponseError) {
        res.status(err.status).json({
            errors: err.message
        }).end();
    }
    else {
        console.error(err);
        res.status(500).json({
            errors: "Internal Server Error",
            detail: err.message
        }).end();
    }
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error-middleware.js.map