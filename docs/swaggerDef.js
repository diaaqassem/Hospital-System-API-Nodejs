const swaggerJSDoc = require("swagger-jsdoc");
const pkg = require("../package.json");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hospital Management System API",
      version: pkg.version,
      description: pkg.description,
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      contact: {
        name: "API Support",
        url: "https://example.com/support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
      {
        url: "https://api.hospital.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
