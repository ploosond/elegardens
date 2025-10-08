import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function successResponse(
  message: string,
  data?: any,
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
    }
  );
}

export function validationErrorResponse(
  zodError: ZodError,
  status: number = 400
) {
  return NextResponse.json(
    {
      success: false,
      message: 'Validation failed',
      errors: zodError.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    },
    { status }
  );
}
