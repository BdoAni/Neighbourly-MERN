import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';

const ReviewCreate = (props) => {
    const { id } = props;
    const [name, setName] = useState("");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [user, setUser] = useState({});
    // const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8000/api/review/${id}`)
            .then(res => {
                console.log(res.data)
                setUser(res.data.user);
                setReview(res.data.results);
                // setLoading(false);
            })
            .catch(err => console.log(err.message))
    }, []);

    // if(loading){
    //     return(
    //         <p>Loading....</p>
    //     )
    // }
    return (

        <div>
            <h1> Details on your review for this user</h1>
            <Link to={`/homepage`}> Home </Link><br />
                    <p><label htmlFor="name">  Reviewer's Name: {review.name}</label></p><br />
                    <p><label htmlFor="rating" >  User Rating: {review.rating}</label></p><br />
                    <p><label htmlFor="review" >  Review: {review.review}</label></p><br />
        </div>
    )
}

export default ReviewCreate;