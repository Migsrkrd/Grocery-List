const { User, List, Item, Notification } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const mongoose = require("mongoose");

const resolvers = {
  Query: {
    // get a user by token (authentication)
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .populate({
            path: "lists",
            populate: [
              {
              path: "items",// Populate the 'items' field within each 'list'
            },
            {
              path: "sentTo",
            },
            ],
          })
          .populate("friends")
          .populate({
            path: "receivedLists",
            populate: [
              {
                path: "items", // Populate the 'items' field within each 'receivedList'
              },
              {
                path: "userId",
              }
            ],
          })
          .populate("notifications");
      }
      throw new Error("You need to be logged in!");
    },
    // get all users
    users: async () => {
      return User.find()
        .populate({
          path: "lists",
          populate: [
            {
            path: "items",// Populate the 'items' field within each 'list'
          },
          {
            path: "sentTo",
          },
          ],
        })
        .populate("friends")
        .populate({
          path: "receivedLists",
          populate: [
            {
              path: "items", // Populate the 'items' field within each 'receivedList'
            },
            {
              path: "userId",
            }
          ],
        })
        .populate("notifications");
    },
    // get a user by username
    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId })
        .populate({
          path: "lists",
          populate: {
            path: "items", // Populate the 'items' field within each 'list'
          },
        })
        .populate("friends")
        .populate({
          path: "receivedLists",
          populate: [
            {
              path: "items", // Populate the 'items' field within each 'receivedList'
            },
            {
              path: "userId",
            }
          ],
        })
        .populate("notifications");
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
      })
      .populate("sentTo");
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
      if (context.user) {
        const list = await List.findByIdAndDelete(args.listId);
      }
      // throw Error('You need to be logged in!');
    },
    // send a list
    sendList: async (parent, args, context) => {
      if (context.user) {
        const givenGuy = await User.findOne({ _id: args.recipientId });
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
              sentTo: givenGuy,
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
    // remove a received list
    removeReceivedList: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { receivedLists: args.listId } },
          { new: true }
        );
        const sender = await User.findOneAndUpdate(
          { _id: args.senderId },
          { $pull: { lists: args.listId } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // update an item
    updateItem: async (parent, args, context) => {
      if (context.user) {
        const item = await Item.findByIdAndUpdate(
          { _id: args.itemId },
          { $set: { ...args } },
          { new: true }
        );
        return item;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    //create a notification
    createNotification: async (parent, args, context) => {
      if (context.user) {
        const notification = await Notification.create({
          ...args,
          senderId: context.user._id,
        });
        await User.findByIdAndUpdate(
          { _id: args.userId },
          { $push: { notifications: notification._id } },
          { new: true }
        );
        return notification;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    //remove a notification
    removeNotification: async (parent, args, context) => {
      if (context.user) {
          const notification = await Notification.findByIdAndDelete(args.notificationId);
        return notification;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    //mark a notification as read
    markNotificationRead: async (parent, args, context) => {
      if (context.user) {
        const notification = await Notification.findByIdAndUpdate(
          { _id: args.notificationId },
          { $set: { isRead: true } },
          { new: true }
        );
        return notification;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
