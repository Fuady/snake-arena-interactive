import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    // Handle Zod validation errors
    if (err.name === 'ZodError') {
        res.status(400).json({
            success: false,
            error: 'Validation error',
            details: err.message,
        });
        return;
    }

    // Handle other errors
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
    });
};
