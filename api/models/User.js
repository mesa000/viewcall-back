const mongoose = require("mongoose");

/**
 * User schema definition.
 * 
 * Represents application users stored in MongoDB.
 * Contains authentication details and additional user information  .
 */
const UserSchema = new mongoose.Schema(
    {
        /**
         * The unique username of the user.
         * @type {String}
         * @required
         */
        username: { type: String, required: true },
        /**
         * The password of the user.
         * Stored as plain text here, but should be hashed
         * before saving in a production environment.
         * @type {String}
         * @required
         */
        password: { type: String, required: true },

        email: { type: String, required: true },

        birthdate : { type: Date, required: true },

        resetPasswordToken: String,
        resetPasswordExpires: Date,

    },
    {
        /**
         * Automatically adds `createdAt` and `updatedAt` fields.
         */
        timestamps: true
    }
);

/**
 * Mongoose model for the User collection.
 * Provides an interface to interact with User documents in MongoDB.
 */
module.exports = mongoose.model("User_movie", UserSchema);