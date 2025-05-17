const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

// Create a singleton Prisma instance
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

// Connect to database with error handling
const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL Connected');
    return prisma;
  } catch (error) {
    logger.error(`Error connecting to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };