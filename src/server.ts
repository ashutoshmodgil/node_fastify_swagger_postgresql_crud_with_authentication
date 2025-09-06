import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import dotenv from "dotenv";
import Fastify from "fastify";
import * as fs from "fs";
import * as path from 'path';
import pino from "pino";
import { fpPostgreSql } from "./plugins/database";
import { registerRoutes } from "./utils/route-helper";

dotenv.config();
const logFile = fs.createWriteStream(path.join(__dirname, 'logs', 'logFile.log'), { flags: 'a' });
const logging = pino(
    {
        level: "info", formatters: {
            level: (label) => {
                return { level: label };
            },
        },
    },
    logFile
);

export const fastify = Fastify({ logger: logging });
const port = process.env.LISTENING_PORT || 8083;
const host = process.env.LISTENING_HOST || "0.0.0.0";

// fastify.register(io);
fastify.register(require('fastify-socket.io'),{
  websocket: true,
});

fastify.register(swagger, {
    swagger: {
        info: {
            title: 'My API',
            description: 'My API description',
            version: '1.0.0',
        },
        securityDefinitions: {
            BearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    // openapi: {
    //     info: {
    //         title: 'My Fastify API',
    //         description: 'Testing the Fastify swagger API',
    //         version: '1.0.0'
    //     },
    //     servers: [
    //         { url: 'http://[::1]:8083' }
    //     ],
    //     components: {
    //         securitySchemes: {
    //             bearerAuth: {
    //                 type: 'http',
    //                 scheme: 'bearer',
    //                 bearerFormat: 'JWT'
    //             }
    //         }
    //     },
    // }
});

fastify.register(swaggerUI, {
    routePrefix: '/docs', // Swagger UI will be served here
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    },
});

fastify.register(fpPostgreSql);
registerRoutes(fastify, fastify.io);

fastify.setErrorHandler((error, request, reply) => {
    console.error(error);
    //   reply.code(500).send('Internal Server Error');
});

fastify.ready().then(() => {
    fastify.io.on('connection', () => {
        fastify.log.info(`Socket.IO connection established`); 
        console.log(`Socket.IO connection established`);
    });
})

console.log(`Starting server at http://${host}:${port}`);

fastify.listen({ port: Number(port), host: host })
    .then(address => {
        fastify.log.info(`Server running at ${address}`);
    })
    .catch(err => {
        fastify.log.error(err);
        process.exit(1);
    });