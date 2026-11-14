const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Research Agent Arena API',
    version: '1.0.0',
    description: `
**AI-Powered Pre-Meeting Research & Agent Benchmarking Platform API**

Endpoints for:
* Managing Pre-Meeting Research Sessions
* Managing Research Tasks (Subjects, Meeting Purposes)
* Storing Real-Time Web Research from **Tavily**
* Storing Research Briefings from **Agent A** & **Agent B** (via **Bifrost** & **Gemini**)
* Storing Benchmark Evaluation Metrics & Arena Winner Determination
* Full Audit History & Timeline Management
    `,
    contact: {
      name: 'Arun - Backend API Developer'
    }
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: 'Local Development Server'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
