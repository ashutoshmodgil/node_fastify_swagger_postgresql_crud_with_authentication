import { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutesPostgres } from "../modules/user/user.route";
import { Socket, DefaultEventsMap, Server } from "socket.io";

export const registerRoutes = (fastify: any, io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    // fastify.register(fpMongoose);
    // fastify.register(userRoutesMongoose);
    fastify.register(authRoutes, { prefix: "", describe: { summary: "Authentication operations" }, routeParams: { tags: ["Auth"], security: [{ bearerAuth: [] }] } });
    fastify.register(userRoutesPostgres, { prefix: "/users", describe: { summary: "User operations" }, routeParams: { tags: ["Users"], security: [{ bearerAuth: [] }] } });
    fastify.register((fastify:FastifyInstance)=>fastify.get('/socket', async (request, reply) => {
        // Handle Socket.IO events here
        io.on('connection', (socket) => {
            console.log('Socket.IO connection established');
    
            // Handle Socket.IO events
            socket.on('event', (data) => {
                console.log('Received event:', data);
            });
    
            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('Socket.IO connection closed');
            });
        });
        return reply.code(200).send('Socket.IO route');
    }), { prefix: "", describe: { summary: "Socket operations" }, routeParams: { tags: ["Socket"], security: [{ bearerAuth: [] }] } });
}
export const registerSocketRoutes = (fastify: any, io:any) => {
    // fastify.register(fpMongoose);
    // fastify.register(userRoutesMongoose);
    fastify.register(authRoutes, { prefix: "", describe: { summary: "Authentication operations" }, routeParams: { tags: ["Auth"], security: [{ bearerAuth: [] }] } });
    fastify.register(userRoutesPostgres, { prefix: "/users", describe: { summary: "User operations" }, routeParams: { tags: ["Users"], security: [{ bearerAuth: [] }] } });

    
}