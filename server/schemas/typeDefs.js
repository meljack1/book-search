const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Book {
        _id: ID
        authors: [String]
        description: String
        bookId: ID
        image: String
        link: String
        title: String
    }

    type User {
        _id: ID
        username: String
        email: String
        password: String
        bookCount: String
        savedBooks: [Book]
    }

    input BookInput {
        authors: [String]
        description: String
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Auth { 
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!) : Auth
        login(email: String!, password: String!) : Auth
        addBook(input: BookInput) : User
        removeBook(bookId: ID!) : User
    }
`
module.exports = typeDefs;