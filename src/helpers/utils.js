"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoDataResponse = exports.CreatedResponse = exports.SuccessResponse = exports.ServiceUnavailableError = exports.NotFoundError = exports.DuplicateError = exports.NotAuthorizedError = exports.BadRequestError = exports.ForbiddenError = exports.AppError = void 0;
const httpCode_1 = require("@/utils/httpCode");
const reasonPhrases_1 = require("@/utils/reasonPhrases");
class AppError extends Error {
    constructor(message, httpCode, errorType) {
        super(message);
        this.httpCode = httpCode;
        this.errorType = errorType;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ForbiddenError extends AppError {
    constructor(message, httpCode = httpCode_1.HttpCode.FORBIDDEN, errorType = reasonPhrases_1.ReasonPhrases.FORBIDDEN) {
        super(message, httpCode, errorType);
    }
}
exports.ForbiddenError = ForbiddenError;
class BadRequestError extends AppError {
    constructor(message, httpCode = httpCode_1.HttpCode.BAD_REQUEST, errorType = reasonPhrases_1.ReasonPhrases.BAD_REQUEST) {
        super(message, httpCode, errorType);
    }
}
exports.BadRequestError = BadRequestError;
class NotAuthorizedError extends AppError {
    constructor(message, httpCode = httpCode_1.HttpCode.UNAUTHORIZED, errorType = reasonPhrases_1.ReasonPhrases.UNAUTHORIZED) {
        super(message, httpCode, errorType);
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
class DuplicateError extends AppError {
    constructor(message, httpCode = httpCode_1.HttpCode.CONFLICT, errorType = reasonPhrases_1.ReasonPhrases.CONFLICT) {
        super(message, httpCode, errorType);
    }
}
exports.DuplicateError = DuplicateError;
class NotFoundError extends AppError {
    constructor(message, httpCode = httpCode_1.HttpCode.NOT_FOUND, errorType = reasonPhrases_1.ReasonPhrases.NOT_FOUND) {
        super(message, httpCode, errorType);
    }
}
exports.NotFoundError = NotFoundError;
class ServiceUnavailableError extends AppError {
    constructor(message, httpCode = httpCode_1.HttpCode.NOT_FOUND, errorType = reasonPhrases_1.ReasonPhrases.NOT_FOUND) {
        super(message, httpCode, errorType);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class SuccessResponse {
    constructor(props = {
        statusCode: httpCode_1.HttpCode.OK,
        success: true,
        data: 'oke',
        errors: undefined,
        message: 'success',
    }) {
        this.statusCode = props.statusCode;
        this.success = props.success;
        this.data = props.data;
        this.errors = props.errors;
        this.message = props.message;
    }
    send(res, headers = {}) {
        return res.status(this.statusCode || httpCode_1.HttpCode.OK).json(this);
    }
}
exports.SuccessResponse = SuccessResponse;
class CreatedResponse extends SuccessResponse {
    constructor({ message = 'oke', data = {}, statusCode = httpCode_1.HttpCode.CREATED, success = true, }) {
        super({ message, data, statusCode, success });
    }
}
exports.CreatedResponse = CreatedResponse;
class NoDataResponse extends SuccessResponse {
    constructor({ message = 'oke', data = {}, statusCode = httpCode_1.HttpCode.NO_CONTENT, success = true, }) {
        super({ message, data, statusCode, success });
    }
}
exports.NoDataResponse = NoDataResponse;
