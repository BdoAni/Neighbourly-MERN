const mongoose = require("mongoose");
const ToolSchema = require('./tools.model');
const ReviewSchema = require('./review.model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

const UserSchema = new mongoose.Schema({
    // userName: {
    //     type: String,
    //     required: [true, "A unique username is required"],
    //     unique: [true, "A user by that username already exists"],
    //     minlength: [2, "Your username must be at least 3 characters long"]
    // },
    firstName: {
        type: String,
        required: [true, "A first name is required"],
        minlength: [2, "A first name must be at 3 characters long"]
    },
    lastName: {
        type: String,
        required: [true, "A last name is required"],
        minlength: [2, "A  last name must be at least 3 characters long"]
    },
    email: {
        type: String,
        required: [true, "An email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validateEmail, "Please enter a valid email."]
    },
    password: {
        type: String,
        required: [true, "A password is required"],
        minlength: [8, "Your password must be at least 8 characters in length"]
    },
    address: {
        type: String,
        required: [true, "You must have an address"],
        minLength: [3, "Please provide a longer address"]
    }, 
    // address: {
    //     street: {
    //         type: String,
    //         required: [true, "You need a valid street address"],
    //         minlength: [2, "Your street address should be longer than that"]
    //     },
    //     city: {
    //         type: String,
    //         required: [true, "Please input a valid city name"],
    //         minLength: [3, "You must enter a valid city name."]
    //     },
    //     state: {
    //         type: String,
    //         required: [true, "You must enter a state"],
    //         minLength: [2, "You must choose a two letter state name"],
    //         maxLength: [2, "You must choose a two letter state name"]
    //     },
    //     zipcode: {
    //         type: Number,
    //         required: [true, "You must enter a zipcode"],
    //         minLength: [5, "You must enter a valid zipcode"]
    //     }
    // },

    tools: [ToolSchema],

    reviews: [ReviewSchema]

}, { timestamps: true });
// near the top is a good place to group our imports

// this should go after 
UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});
// add this after UserSchema is defined
UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);

UserSchema.pre('validate', function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});


const User = mongoose.model("User", UserSchema);
module.exports = User;