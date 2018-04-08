const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')


const resolvers = {
    Query,
    Mutation,
    AuthPayload,
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: './src/generated/prisma.graphql',
            endpoint: 'http://localhost:4466/hackernews-node/dev',
            secret: 'mysecret123',
            debug: true
        }),
    }),
});

const options = {
    port: 3001,
};

server.start(options, () => console.log(`Running on localhost:${options.port}`));