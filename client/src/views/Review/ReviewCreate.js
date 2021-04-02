import React, { useState } from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    Checkbox,
    Select,
    Button, 
    TextField
} from '@material-ui/core';

const styles = {
    paper: {
        width: "12rem", padding: "1rem", display: "inline-block", verticalAlign: 'text-top'
    },
    input: {
        marginBottom: "1rem"
    },
    button: {
        width: "50%"
    }
}


const ReviewCreate = (props) => {
    const [name, setName] = useState("");
    const [rating, setRating] = useState("");
    const [review, setReview] = useState("");
    // const [description, setDescription] = useState("");
    // const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState({});
    // const [user, setUser] = useState({});
    const { id } = props;


    const onSubmitHandler = (e) => {
        e.preventDefault();
        //make a post request to create a new review
        axios.post(`http://localhost:8000/api/user/${id}/review`, {
            name,
            rating,
            review
            // address,
            // // type,
            // // description,
            // // price
        })
            .then(res => {
                console.log(res);
                if (res.data.message == "error") {
                    setErrors(res.data.errors.errors.reviews.errors)
                } else { navigate("/homepage") }
            })
            .catch(err => console.log(err))
    }

    return (

        <div>
            <Button color="primary" variant="outlined" onClick={e => navigate(`/homepage`)}>Home</Button>
            <h3> Create a review for this user</h3>
            <div elevation={1} style={styles.paper}>
            <form onSubmit={onSubmitHandler}>
                <FormControl variant="outlined" style={styles.input}>
                    <InputLabel>Reviewer's Name</InputLabel>
                    <OutlinedInput type="text" name="name" onChange={(e) => setName(e.target.value)} value={name}/>
                <span> {errors.name ? errors.name.message : ''} </span>
                </FormControl>
                <FormControl variant="outlined" style={styles.input}>
                    <InputLabel>User Rating</InputLabel>
                    <OutlinedInput type="number" name="rating" onChange={(e) => setRating(e.target.value)} value={rating}/>
                <span> {errors.rating ? errors.rating.message : ''} </span>
                </FormControl>
                <FormControl variant="outlined" style={styles.input}>
                    <TextField id="outlined-basic" label="Review" variant="outlined" type="text" name="review" onChange={(e) => setReview(e.target.value)} value={review}/>
                <span> {errors.review ? errors.review.message : ''} </span>
                </FormControl>
                {/* <textarea name="review" id="review" cols="50" rows="10" placeholder="Please tell us about your experience..."></textarea><br/> */}
                <Button type="submit" variant="contained" color="primary">
                    Submit Review
                </Button>
            </form>
            </div>
        </div>

    )
}

export default ReviewCreate;