import { ERROR_CODES } from "./constants.js"

export const handleException = (errorMessage) => {
    if (Object.values(ERROR_CODES).includes(errorMessage)) {
        return { status: 400, errorMessage }
    } else if (errorMessage === "jwt expired") {
        return { status: 401 }
    } else {
        return { status: 500 }
    }
}