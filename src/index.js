const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding'); 

const resolvers = {
    Query: {
        info: () => `This is the api for a Hackernews clone`,
        feed: (root, args, context, info) => {
            console.log(info)
            return context.db.query.links({}, info);
        }
    },
    Mutation: {
        post: (root, args, context, info) => {
            return context.db.mutation.createLink({
                data: {
                    url: args.url,
                    description: args.url
                }
            }, info);
        },        
    }
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