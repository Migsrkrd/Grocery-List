const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    lists: [List]
    }

type Auth {
    token: ID!
    user: User
    }

type Item {
    _id: ID
    name: String
    description: String
    quantity: Int
    }

type List {
    _id: ID
    name: String
    items: [Item]
    }

type Query {
    me: User
    }

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addList(name: String!): List
    addItem(name: String!, description: String!, quantity: Int!): Item
    removeItem(itemId: ID!): Item
    removeList(listId: ID!): List
    }
    `;

module.exports = typeDefs;
