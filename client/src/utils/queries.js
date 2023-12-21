import {gql} from '@apollo/client';

export const QUERY_ME = gql`
    query me {
        me {
            _id
            email
            lists {
              dateCreated
              name
              _id
              items {
                _id
                description
                name
                quantity
              }
            }
            username
            friends {
              _id
              username
            }
            receivedLists {
              _id
              name
              dateCreated
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
    
    export const QUERY_LISTS = gql`
    query lists {
        lists {
            _id
            name
            dateCreated
            items {
                _id
                name
                description
                quantity
            }
        }
    }
    `
    
    export const QUERY_LIST = gql`
    query list($listId: ID!) {
        list(listId: $listId) {
            _id
            name
            dateCreated
            items {
                _id
                name
                description
                quantity
            }
        }
    }
    `
    
    export const QUERY_USER = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
            lists {
                _id
                name
                dateCreated
                items {
                    _id
                    name
                    description
                    quantity
                }
            }
            friends {
                _id
                username
            }
            receivedLists {
                _id
                name
                dateCreated
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
    export const QUERY_USERS = gql`
    query users {
        users {
            _id
            username
            email
            lists {
                _id
                name
                dateCreated
                items {
                    _id
                    name
                    description
                    quantity
                }
            }
            friends {
                _id
                username
            }
            receivedLists {
                _id
                name
                dateCreated
                items {
                    _id
                    name
                    description
                    quantity
                }
            }
        }
    }
    `;
