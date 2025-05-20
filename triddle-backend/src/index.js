const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { connectDB } = require('./config/db');
const config = require('./config');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Route files
const auth = require('./routes/auth.routes');
const users = require('./routes/users.routes');
const forms = require('./routes/forms.routes');
const responses = require('./routes/responses.routes');

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Triddle Form Builder API',
      version: '1.0.0',
      description: 'API documentation for Triddle Form Builder',
      contact: {
        name: 'API Support',
        email: 'support@triddle.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://triddle-form-builder-bk.vercel.app/api/v1',
        description: 'Production server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

// Initialize database connection
connectDB();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(
  fileupload({
    createParentPath: true,
  })
);

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500, // 500 requests per 10 minutes
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

// Mount Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/forms', forms);
app.use('/api/v1/responses', responses);

// Error handler middleware
app.use(errorHandler);

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.error(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});