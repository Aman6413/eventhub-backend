import { ERROR_CODES } from "./constants.js"

export const handleException = (errorMessage) => {
    if (!errorMessage) return { status: 500 };

    if (Object.values(ERROR_CODES).includes(errorMessage)) {
        return { status: 400, errorMessage };
    }

    // treat any jwt-related error as unauthorized
    if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('jwt')) {
        return { status: 401, errorMessage };
    }

    if (errorMessage === "jwt expired") {
        return { status: 401, errorMessage };
    }

    return { status: 500, errorMessage };
}