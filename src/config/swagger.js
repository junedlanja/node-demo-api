
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info: {
        title: "Food Event Demo",
        version: '1.0.0', 
        description: `Food Event Demo API Collection`, 
    },
    host: `${process.env.HOST}`, 
    basePath: '/v1/', 
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/v1/*.js', './src/utils/swagger.yml'],
};

module.exports = swaggerJSDoc(options);