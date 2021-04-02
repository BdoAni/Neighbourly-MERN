const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "You must leave a name to leave a review"],
        minlength: [3, "You must have at least 3 characters to leave a name."]
    },
    rating: {
        type: Number,
        required: [true, "You must leave an actual rating"],
        min: [1, "Rating must be more than 1 star."],
        max: [5, "Rating can't be more than 5 stars."]
    },
    review: {
        type: String,
        required: [true, "You must say something to leave a review"],
        minlength: [3, "You must write a longer review."]
    }
}, { timestamps: true });

const Review = mongoose.model("Review", ReviewSchema);
module.exports = ReviewSchema;