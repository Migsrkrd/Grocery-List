const {User, List, Item} = require('../models');
const {signToken, AuthenticationError} = require('../utils/auth');

const resolvers = {
    Query: {
        // get a user by token (authentication)
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id: context.user._id}).populate('lists');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        // add a user
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },
        // login a user
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});
            if (!user) {
                throw AuthenticationError;
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError;
            }
            const token = signToken(user);
            return {token, user};
        },
        // add a list
        addList: async (parent, args, context) => {
            // Check if context is defined and has user data
            console.log("user",context.user)
            if (context && context.user) {
                // Your logic when context has user data
                const list = await List.create({ ...args, username: context.user.username });
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { lists: list._id } },
                    { new: true }
                );
                return list;
            } else {
                // Your logic when context does not have user data
                throw new Error('You need to be logged in (List)!');
            }
        },
        
        // add an item
        addItem: async (parent, args, context) => {
            // Check if context is defined and has user data
            if (context && context.user) {
                // Your logic when context has user data
                const item = await Item.create({ ...args, username: context.user.username });
                await List.findByIdAndUpdate(
                    { _id: args.listId },
                    { $push: { items: item._id } },
                    { new: true }
                );
                return item;
            } else {
                // Your logic when context does not have user data
                throw new Error('You need to be logged in!(Item)');
            }
        },
        // remove an item
        removeItem: async (parent, args, context) => {
            if (context.user) {
                const item = await Item.findByIdAndDelete(args.itemId);
                await List.findByIdAndUpdate(
                    {_id: args.listId},
                    {$pull: {items: args.itemId}},
                    {new: true}
                );
                return item;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // remove a list
        removeList: async (parent, args, context) => {
            if(context.user){
                const list = await List.findByIdAndDelete(args.listId);
            }
            throw new AuthenticationError('You need to be logged in!');
    }
}
};

module.exports = resolvers;