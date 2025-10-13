import { NextRequest } from 'next/server';
import { errorResponse } from './apiResponse';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  username: string;
  role: string;
}

export default function adminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || typeof jwtSecret !== 'string') {
    return errorResponse('JWT secret is not configured on the server', 500);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    if (!decoded || decoded.role !== 'ADMIN') {
      return errorResponse('Admin access required', 401);
    }
    return null;
  } catch (error) {
    console.error('Admin token verification error: ', error);
    return errorResponse('Invalid admin token', 401);
  }
}
