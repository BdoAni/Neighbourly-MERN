const User = require("../models/project.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY

// /C This function is creating a new author
module.exports.createNewUser = (req, res) => {
    User.create(req.body)
        .then(user => {
            console.log(user)
            const userToken = jwt.sign({
                id: user._id
            }, SECRET_KEY);
            res
                .cookie("usertoken", userToken, secret, {
                    httpOnly: true
                })
                .json({ msg: "success!", user: user });
        })
        .catch(err => res.json(err));
};
module.exports.loginUser = async(req, res) => {
    console.log(SECRET_KEY)
    const user = await User.findOne({ email: req.body.logEmail });
    console.log(user)
    if (user === null) {
        // email not found in users collection
        return res.sendStatus(400);
    }
    // if we made it this far, we found a user with this email address
    // let's compare the supplied password to the hashed password in the database
    const correctPassword = await bcrypt.compare(req.body.logPassword, user.password);
    if (!correctPassword) {
        // password wasn't a match!
        return res.sendStatus(400);
    }
    // if we made it this far, the password was correct
    const userToken = jwt.sign({
        id: user._id
    }, SECRET_KEY);
    // note that the response object allows chained calls to cookie and json
    res.cookie("usertoken", userToken, SECRET_KEY, {
            httpOnly: true
        })
        .json({ msg: "success!" });
};

module.exports.createNewTool = (req, res) => {
    User.findOneAndUpdate({_id: req.params.id}, { $addToSet: { tools: req.body}}, {new: true, runValidators: true})
        .then(data => res.json({message: "success", results: data}))
        .catch(err => res.json({message: "error", errors: err}))
};

module.exports.createNewReview = (req, res) => {
    User.findOneAndUpdate({_id: req.params.id}, { $addToSet: { reviews: req.body}}, {new: true, runValidators: true})
        .then(data => res.json({message: "success", results: data}))
        .catch(err => res.json({message: "error",  errors: err}))
};

// Read
module.exports.getAllUsers = (req, res) => {
    User.find()
        .then(user => res.json({results: user}))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.getOneUser = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(findeOneUser => res.json({ user: findeOneUser }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.getOneTool = (req, res) => {
    User.findOne({"tools._id": req.params.id})
        .then(data => res.json({message: "Success", results: data.tools.filter(item => item._id == req.params.id)[0]}))
        .catch(err => res.json({errors: err}))
};

module.exports.getOneToolPrice = (req, res) => {
    User.findOne({"tools._id": req.params.id})
        .then(data => res.json({message: "Success", results: data.tools.filter(item => item._id == req.params.id)[0].price}))
        .catch(err => res.json({errors: err}))
};

module.exports.getAllTools = (req, res) => {
    User.find({"tool._id": req.params.tool_id})
        .then(data => res.json({results: data}))
        .catch(err => res.json({errors: err}))
};

module.exports.getOneReview = (req, res) => {
    User.findOne({"reviews._id": req.params.id})
        .then(data => res.json({message: "Success", results: data.reviews.filter(item => item._id == req.params.id)[0]}))
        .catch(err => res.json({errors: err}))
};

module.exports.getAllReviews = (req, res) => {
    User.find({"reviews._id": req.params.review_id})
        .then(data => res.json({results: data}))
        .catch(err => res.json({errors: err}))
};

// Update
module.exports.updateUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
        .then(updateUser => res.json({ user: updateUser }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.updateTool = (req, res) => {
    User.findOneAndUpdate({ "tools._id": req.params.id }, req.body, { new: true, runValidators: true })
        .then(updateTool => res.json({ user: updateTool }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.updateReview = (req, res) => {
    User.findOneAndUpdate({ "reviews._id": req.params.id }, req.body, { new: true, runValidators: true })
        .then(updateReview => res.json({ user: updateReview }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.deleteTool = (req, res) => {
    User.findOneAndUpdate({ "tools._id": req.params.tool_id }, {$pull: { tools: req.body } })
    .then(user => res.json({ user: user }))
    .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.deleteReview = (req, res) => {
    User.findOneAndUpdate({ "reviews._id": req.params.review_id }, {$pull: { reviews: req.body } })
    .then(user => res.json({ user: user }))
    .catch(err => res.json({ message: "Something went wrong", error: err }));
};

// Delete
module.exports.deleteUser = (req, res) => {
    User.deleteOne({ _id: req.params.id })
    .then(user => res.json({ user: user }))
    .catch(err => res.json({ message: "Something went wrong", error: err }));
};
// to add on the nested schema   add to the updateUser controller {$addToSet:{quotes: req.body}}()