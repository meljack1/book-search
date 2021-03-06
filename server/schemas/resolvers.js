const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query : {
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate('thoughts');
            }
            throw new AuthenticationError('You must be logged in!');
          },  
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },      
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address.');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials.');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },    
          addBook: async (parent, { input }, context) => {
            if (context.user) {
              return await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input }, },
                { new: true, runValidators: true },
              );
            }
            throw new AuthenticationError('You need to be logged in to save a book!');
          },
          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
              );
            }
            throw new AuthenticationError('You need to be logged in to remove a book!');
          },
       
    }
};

module.exports = resolvers;