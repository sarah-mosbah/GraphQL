import { createServer } from 'node:http';
import { createYoga, createSchema } from 'graphql-yoga';
import {uuid} from 'uuidv4';
const comments = [{
    id: 1,
    text: 'Hello This is My Comment',
    authorId: '2',
    postId: '10'
},{
    id: 2,
    text: 'Hello This is My Comment 2',
    authorId: '3',
    postId: '10'
},
{
    id: 3,
    text: 'Hello This is My Comment 3',
    authorId: '1',
    postId: '11'
},
{
    id: 4,
    text: 'Hello This is My Comment 4',
    authorId: '2',
    postId: '12'
}]
const users = [{
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27,
    comments: [3]
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
    comments: [1, 4]
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
    comments: [2]
}]

const posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1',
    comments: [1, 2]
}, {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1',
    comments: [3]
}, {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2',
    comments: [4]
}]
// Type Definitions (schema)
const typeDefs = `
    type Query {
       users: [User!]!
       me: User!
       post: Post!
       posts(query: String): [Post!]!
       comments: [Comment]
    }
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!
            body: String!
            published: Boolean!
            author: User!): Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        comments(parent, args, ctx, info) {
            return comments;
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
           const emailTaken = users.some((user) => user.email === args.email);
           if(emailTaken) throw new Error('Email is Taken');
           const id  =  uuid();
           const addedUser  =  {
            email: args.email,
            name: args.name,
            age: args.age,
            id
           };
           users.push(addedUser);
           return addedUser;
        }
    },
    Post: {
        author(parent, args)  {
            return users.find((user) => user.id === parent.author)
        },
        comments(parent, args) {
            return comments.filter((comment) => comment.postId === parent.id)
        }
    },
    User: {
        posts(parent, args)  {
            return posts.filter((post) => post.author === parent.id)
        },
        comments(parent, args) {
            return comments.filter((comment) => comment.authorId === parent.id)
        }
    },
    Comment: {
        author(parent, args) {
            return users.find((user) => user.id === parent.authorId)
        },
        post(parent, args)  {
            return posts.find((post) => post.id === parent.postId)
        },
    }
}
const schema = createSchema({
    typeDefs, resolvers
});


const yoga = createYoga({ schema,  graphqlEndpoint: '/', });
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga);
server.listen(3005, ()=> console.log('Im up'))