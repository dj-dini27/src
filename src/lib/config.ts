// Environment configuration
export const config = {
  // Database
  databaseUrl: process.env.DATABASE_URL || 'file:./db/custom.db',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Socket.IO
  socketUrl: process.env.SOCKET_IO_URL || 'http://localhost:3000',
  socketPath: process.env.SOCKET_IO_PATH || '/socket.io',
  
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  nextAuthSecret: process.env.NEXTAUTH_SECRET || 'fallback-nextauth-secret',
  
  // API
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Development/Production flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Feature flags
  enableSocketIO: true,
  enableJWT: true,
  enableAnalytics: false,
  
  // Timeouts
  socketTimeout: 5000,
  apiTimeout: 10000,
  
  // Pagination
  defaultPageSize: 10,
  maxPageSize: 100,
};

// Export individual configs for easy access
export const jwtConfig = {
  secret: config.jwtSecret,
  expiresIn: config.jwtExpiresIn,
};

export const socketConfig = {
  url: config.socketUrl,
  path: config.socketPath,
  timeout: config.socketTimeout,
};

export const apiConfig = {
  baseUrl: config.apiBaseUrl,
  timeout: config.apiTimeout,
  defaultPageSize: config.defaultPageSize,
  maxPageSize: config.maxPageSize,
};