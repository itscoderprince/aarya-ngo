import { NextResponse } from "next/server";

/**
 * Standardized success response
 * @param {any} data - The payload
 * @param {number} status - HTTP status code (default 200)
 */
export function successResponse(data, status = 200) {
    return NextResponse.json(
        { success: true, data },
        { status }
    );
}

/**
 * Standardized error response
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default 500)
 * @param {any} error - Optional error details (for debugging)
 */
export function errorResponse(message, status = 500, error = null) {
    const response = { success: false, message };

    if (process.env.NODE_ENV === "development" && error) {
        response.debug = error.message || error;
    }

    return NextResponse.json(response, { status });
}

/**
 * Wrapper to handle try-catch blocks automatically
 * @param {Function} handler - Async API handler function
 */
export function apiHandler(handler) {
    return async (req, ...args) => {
        try {
            return await handler(req, ...args);
        } catch (error) {
            console.error("API Error:", error);
            return errorResponse(error.message || "Internal Server Error", 500, error);
        }
    };
}
