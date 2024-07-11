// 400
export class SomethingWentWrongError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SomethingWentWrongError';
    }
}

// 401
export class UnauthenticatedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthenticatedError';
    }
}

// 403
export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

// 404
export class ResourceNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ResourceNotFoundError';
    }
}

export class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InternalServerError';
    }
}

export class ErrorPocketBaseConnection extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ErrorPocketBaseConnection';
    }
}