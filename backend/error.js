export class ErrorResponse extends Error {
    status
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode
    }
}