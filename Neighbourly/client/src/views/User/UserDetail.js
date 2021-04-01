import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';


export default props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [address, setAddress] = useState("");
    const { id } = props;
    const [user, setUser] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/` + id)
            .then(res => {
                console.log(res.data)
                setUser(res.data.user);
                setFirstName(res.data.user.firstName);
                setLastName(res.data.user.lastName);
                // setAddress(res.data.user.address);
                setLoaded(true);
            })
            .catch(err => console.log(err.message))
    }, []);

    const deleteUser = (userId) => {
        axios.delete(`http://localhost:8000/api/user/` + userId)
            .then(res => {
                navigate('/homepage')
            })
    }
    const reviewUser = (userId) => {
        axios.post(`http://localhost:8000/api/user/$_id/review` )
            .then(res => {
                navigate('/homepage') //create a review for user
            })
    }
    return (
        <div><Link to={`/homepage`}> Home </Link><br />
            <h2>Details for {firstName} {lastName}</h2>

            <p><label htmlFor="First Name" >First Name: {firstName}</label></p>
            
            <p><label htmlFor="Last Name" > Last Name: {lastName}</label></p>
            
            {/* <p><label htmlFor="Address" > Address: {address}</label></p><br /> */}

            <button onClick={(e) => reviewUser(user._id)}> Write a review for {firstName} </button> <br/> <br/>

            <button onClick={(e) => deleteUser(user._id)}> Delete {firstName} </button>

        </div>
    )
}