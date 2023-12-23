import {gql} from '@apollo/client';

export const ADD_ITEM = gql`
    mutation addItem($listId: String!, $name: String!, $description: String, $quantity: Int!) {
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
    mutation removeItem($itemId: String!, $listId: String!) {
        removeItem(itemId: $itemId, listId: $listId) {
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
    `
    
    export const SEND_LIST = gql`
    mutation sendList($listId: ID!, $recipientId: String!) {
        sendList(listId: $listId, recipientId: $recipientId) {
          _id
          dateCreated
          items {
            _id
            description
            name
            quantity
          }
          name
          userId
          sentTo {
            username
          }
          isSent
        }
      }
    `

    export const ADD_FRIEND = gql`
    mutation addFriend($friendId: String!) {
        addFriend(friendId: $friendId) {
        _id
        username
        email
        }
    }
    `
    export const REMOVE_FRIEND = gql`
    mutation removeFriend($friendId: ID!) {
        removeFriend(friendId: $friendId) {
        _id
        username
        email
        }
    }
    `

    export const REMOVE_RECEIVED_LIST = gql`
    mutation removeReceivedList($listId: ID!, $senderId: ID!) {
        removeReceivedList(listId: $listId, senderId: $senderId) {
        _id
        username
        email
        receivedLists {
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
    `

    export const UPDATE_ITEM = gql`
    mutation updateItem($itemId: ID!, $name: String!, $description: String, $quantity: Int!) {
        updateItem(itemId: $itemId, name: $name, description: $description, quantity: $quantity) {
        _id
        name
        description
        quantity
        }
    }
    `
    ;

    