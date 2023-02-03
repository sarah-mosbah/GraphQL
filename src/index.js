import { createServer } from 'node:http';
import { createYoga, createSchema } from 'graphql-yoga';

const users = [{
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}]
// Type Definitions (schema)
const posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1'
}, {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1'
}, {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2'
}]

const typeDefs = `
    type Query {
       users: [User!]!
       me: User!
       post: Post!
       posts(query: String): [Post!]!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        me: () => {
            return {
                id: 'qjdjdjdj',
                title: 'my title',
                email: "Helloojm@x.com",

            }
        },
        post: () => {
                return {
                    id: 'qjdjdjdj',
                    title: 'Sarah',
                    body: "Helloojm@x.com",
                    published: true
                }
        },
        posts: (parent, args) => {
            if(!args.query) return posts;
            const insensetiveQuery = args.query.toLowerCase();
            return posts.filter((post) => post.body.toLowerCase().includes(insensetiveQuery) || 
            post.title.toLowerCase().includes(insensetiveQuery))
        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
    },
    Post: {
        author(parent, args)  {
            return users.find((user) => user.id === parent.author)
        }
    },
    User: {
        posts(parent, args)  {
            console.log(parent)
            return posts.filter((post) => post.author === parent.id)
        }
    }
}
const schema = createSchema({
    typeDefs, resolvers
});


const yoga = createYoga({ schema });
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga);
server.listen(3005, ()=> console.log('Im up'))