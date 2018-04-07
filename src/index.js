const { GraphQLServer } = require('graphql-yoga');

let links = [
    {
        id: 'link-0',
        url: 'www.howtographql.com',
        description: 'Fullstack tutorial for GraphQL',
    },
    {
        id: 'link-1',
        url: 'egghead.io',
        description: 'Amazing courses!',
    }
]

let idCount = links.length;

const resolvers = {
    Query: {
        info: () => `This is the api for a Hackernews clone`,
        feed: () => links,
        link: (root, args) => { 
            return links.filter(l => l.id === args.id)[0];
        }
    },
    Mutation: {
        post: (root, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };
            links.push(link);
            return link;
        },
        updateLink: (root, args) => {            
            let linkIndex = links.findIndex(link => link.id === args.id);
            let link = links.splice(linkIndex, 1);
            link = { ...link, ...args };
            links.push(link);
            return link;            
        },
        deleteLink: (root, args) => {
            let linkIndex = links.findIndex(link => link.id === args.id);
            var link = links[linkIndex];
            links.splice(linkIndex, 1);
            return link;
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});

const options = {
    port: 3001,
};

server.start(options, () => console.log(`Running on localhost:${options.port}`));