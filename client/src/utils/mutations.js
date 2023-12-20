import {gql} from '@apollo/client';

export const ADD_ITEM = gql`
    mutation addItem($listId: ID!, $name: String!, $description: String, $quantity: Int) {
        addItem(listId: $listId, name: $name, description: $description, quantity: $quantity) {
        _id
        name
        description
        quantity
        }
    }
    `;

export const ADD_LIST = gql`
    mutation addList($name: String!) {
        addList(name: $name) {
        _id
        name
        items {
            _id
            name
            description
            quantity
        }
        }
    }
    `;

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
        token
        user {
            _id
            username
            email
            lists {
            _id
            name
            items {
                _id
                name
                description
                quantity
            }
            }
        }
        }
    }
    `;

export const REMOVE_ITEM = gql`
    mutation removeItem($listId: ID!, $itemId: ID!) {
        removeItem(listId: $listId, itemId: $itemId) {
        _id
        name
        description
        quantity
        }
    }
    `;

export const REMOVE_LIST = gql`
    mutation removeList($listId: ID!) {
        removeList(listId: $listId) {
        _id
        name
        items {
            _id
            name
            description
            quantity
        }
        }
    }
    `;

export const SIGNUP_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            username
            email
        }
        }
    }
    `;

    