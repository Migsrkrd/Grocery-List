const { User, List, Item } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    // get a user by token (authentication)
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .populate({
            path: "lists",
            populate: {
              path: "items",// Populate the 'items' field within each 'list'
            },
          })
          .populate("friends")
          .populate("receivedLists");
      }
      throw new Error("You need to be logged in!");
    },
    // get all users
    users: async () => {
      return User.find()
        .populate({
          path: "lists",
          populate: {
            path: "items", // Populate the 'items' field within each 'list'
          },
        })
        .populate("friends")
        .populate("receivedLists");
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .populate({
          path: "lists",
          populate: {
            path: "items", // Populate the 'items' field within each 'list'
          },
        })
        .populate("friends");
    },
    // get all lists
    lists: async () => {
      return List.find().populate({
        path: "items", // Populate the 'items' field within each 'list'
      });
    },
    // get a list by id
    list: async (parent, { listId }) => {
      return List.findOne({ _id: listId }).populate({
        path: "items", // Populate the 'items' field within each 'list'
      });
    },
    // get all items
    items: async () => {
      return Item.find();
    },
    // get an item by id
    item: async (parent, { itemId }) => {
      return Item.findOne({ _id: itemId });
    },
  },
  Mutation: {
    // add a user
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // login a user
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);

      return { token, user };
    },
    // add a list
    addList: async (parent, args, context) => {
      // Check if context is defined and has user data
      if (context && context.user) {
        // Your logic when context has user data
        const list = await List.create({
          ...args,
          userId: context.user._id,
        });
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { lists: list._id } },
          { new: true }
        );
        return list;
      } else {
        // Your logic when context does not have user data
        throw new Error("You need to be logged in!(List)");
      }
    },

    // add an item
    addItem: async (parent, args, context) => {
      // Check if context is defined and has user data
      if (context && context.user) {
        // Your logic when context has user data
        const item = await Item.create({
          ...args,
          username: context.user.username,
        });
        await List.findByIdAndUpdate(
          { _id: args.listId },
          { $push: { items: item._id } },
          { new: true }
        );
        return item;
      } else {
        // Your logic when context does not have user data
        throw new Error("You need to be logged in!(Item)");
      }
    },
    // remove an item
    removeItem: async (parent, args, context) => {
      if (context.user) {
        const item = await Item.findByIdAndDelete(args.itemId);
        await List.findByIdAndUpdate(
          { _id: args.listId },
          { $pull: { items: args.itemId } },
          { new: true }
        );
        return item;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // remove a list
    removeList: async (parent, args, context) => {
      console.log("user", context.user);
      if (context.user) {
        const list = await List.findByIdAndDelete(args.listId);
      }
      // throw Error('You need to be logged in!');
    },
    // send a list
    sendList: async (parent, args, context) => {
      if (context.user) {
        // Update the recipient's receivedLists
        const recipient = await User.findByIdAndUpdate(
          { _id: args.recipientId },
          { $push: { receivedLists: args.listId } },
          { new: true }
        );
    
        // Update the sender's list to mark it as sent
        const myself = await List.findByIdAndUpdate(
          { _id: args.listId, userId: context.user._id },
          {
            $set: {
              isSent: true,
            },
            $push: {
              sentTo: recipient,
            },
          },
          { new: true }
        );
    
        return myself;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // add a friend
    addFriend: async (parent, args, context) => {
      if (context.user) {
        const friend = await User.findByIdAndUpdate(
          { _id: args.friendId },
          { $push: { friends: context.user._id } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { friends: args.friendId } },
          { new: true }
        );

        console.log("friend", friend);
        return friend;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // remove a friend
    removeFriend: async (parent, args, context) => {
      if (context.user) {
        console.log(context.user);
        const friend = await User.findByIdAndUpdate(
          { _id: args.friendId },
          { $pull: { friends: context.user._id } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { friends: args.friendId } },
          { new: true }
        );
        return friend;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
