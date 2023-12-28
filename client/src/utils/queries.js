import {gql} from '@apollo/client';

export const QUERY_ME = gql`
    query me {
        me {
          friends {
            _id
            email
            username
          }
          _id
          username
          email
          notifications {
            _id
            isRead
            text
            dateCreated
            senderId
            userId
          }
          receivedLists {
            _id
            userId
            name
            isSent
            dateCreated
            items {
              _id
              name
              description
              quantity
            }
          }
          lists {
            _id
            dateCreated
            isSent
            name
            userId
            sentTo {
              username
              _id
              email
            }
            items {
              _id
              description
              name
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
    query user($userId: ID!) {
        user(userId: $userId) {
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
          email
          username
        }
      }
    `;
