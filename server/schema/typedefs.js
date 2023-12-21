const typeDefs = `
type User {
    _id: ID!
    username: String!
    email: String!
    friends: [User]
    lists: [List]
    sentLists: [List]
    receivedLists: [List]
    }

type Auth {
    token: ID!
    user: User
    }

type Item {
    _id: ID!
    name: String!
    description: String
    quantity: Int!
    }

type List {
    _id: ID!
    userId: ID!
    name: String
    items: [Item]
    isSent: Boolean
    sentTo: [User]
    dateCreated: String!
    }

type Query {
    me: User
    users: [User]
    user(username: String!): User
    lists: [List]
    list(listId: ID!): List
    items: [Item]
    item(itemId: ID!): Item
    }

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addList(name: String!): List
    addItem(listId: String! name: String!, description: String, quantity: Int!): Item
    removeItem(itemId: String!, listId: String!): Item
    removeList(listId: ID!): List
    sendList(listId: ID!, recipientId: String!): List
    addFriend(friendId: String!): User
    removeFriend(friendId: ID!): User
    }
    `;

module.exports = typeDefs;
