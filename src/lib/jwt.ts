import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

// Get JWT secret from environment
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return new TextEncoder().encode(secret);
};

// Get JWT expiration time
const getJwtExpiresIn = () => {
  return process.env.JWT_EXPIRES_IN || '24h';
};

// JWT Payload interface
interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Sign JWT token
export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = getJwtSecret();
  const expiresIn = getJwtExpiresIn();
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
    
  return token;
}

// Verify JWT token
export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    
    return payload as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Extract JWT from request
export function extractJWT(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

// Create JWT for user
export async function createUserToken(user: {
  id: string;
  email: string;
  role: string;
}): Promise<string> {
  return signJWT({
    id: user.id,
    email: user.email,
    role: user.role
  });
}

// Middleware to verify JWT
export async function withAuth(request: NextRequest) {
  const token = extractJWT(request);
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const payload = await verifyJWT(token);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}