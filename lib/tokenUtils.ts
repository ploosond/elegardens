import jwt from 'jsonwebtoken';

export const validateToken = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    return decoded && decoded.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

export const clearInvalidTokens = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};
