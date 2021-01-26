const { ApolloServer, gql, PubSub } = require('apollo-server')

const pubsub = new PubSub()

const ADD_POST = 'ADD_POST'

const posts = [
  { id: 1, text: 'Post One' },
  { id: 2, text: 'Post Two' },
  { id: 3, text: 'Post Three' },
  { id: 4, text: 'Post Four' }
]

const typeDefs = gql`
  type Post {
    id: ID
    text: String
  }
  type Query {
    allPosts: [Post]
    post(id: ID): Post
  }
  type Mutation {
    addPost(id: ID, text: String): Post
  }
  type Subscription {
    subAddPost: Post
  }
`
const resolvers = {
  Query: {
    allPosts: () => posts,
    post: (_, { id }) => {
      return posts.filter(post => post.id === id)
    }
  },
  Mutation: {
    addPost: (_, { id, text }) => {
      posts.push({ id, text })
      const createdPost = { id, text }
      pubsub.publish(ADD_POST, { subAddPost: createdPost })
      return createdPost
    }
  },
  Subscription: {
    subAddPost: {
      subscribe: () => pubsub.asyncIterator(ADD_POST)
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen(8000).then(() => console.log('Apollo Server ruing!!!!!!!'))
